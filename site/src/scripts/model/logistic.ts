/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import type {GameLogistic, GameLogisticTransport} from '#types/game-data';
import {binarySearch} from '../util';
import type {BlueprintModel, LinkModel, LogisticModel, LogisticSetModel, TransportModel} from './store';


export class TransportModelImpl {
    private readonly _transport: GameLogisticTransport;
    private readonly _index: number;
    private readonly _link: LinkModel;

    constructor(_transport: GameLogisticTransport, _index: number, _link: LinkModel) {
        this._transport = _transport;
        this._index = _index;
        this._link = _link;
    }

    get name() { return this._transport.name; }
    get index() { return this._index; }
    get countPerSecond() { return this._transport.countPerSecond; }
    get count() {
        const flow = this._link.flow;
        return Math.ceil((flow || 0) / this._transport.countPerSecond);
    }
    get item() { return this._transport.item; }
    get label() { return this._transport.label || this._transport.item.label; }
    formatCountPerSecond(count: number) { return this._transport.formatCountPerSecond(count); }
}


export class LogisticModelImpl {
    private readonly _logistic: GameLogistic;
    private readonly _link: LinkModel;
    private readonly _globals: BlueprintModel;

    private _selectedTransport?: TransportModel;

    constructor(_logistic: GameLogistic, _link: LinkModel, _globals: BlueprintModel) {
        this._logistic = _logistic;
        this._link = _link;
        this._globals = _globals;
    }

    get isLocked() {
        const selectedTransport = this.selectedTransport;
        if(!selectedTransport)
            return false;
        const lockedTransportName = this._globals.getLockedTransport(this._logistic.name);
        return lockedTransportName == selectedTransport.name;
    }
    toggleLockSelected() {
        const selectedTransport = this.selectedTransport;
        if(!selectedTransport)
            return;
        const isLocked = this.isLocked;
        this._globals.lockTransport(
            this._logistic.name,
            isLocked ? undefined : selectedTransport.name,
        );
    }
    get name() { return this._logistic.name; }
    get label() { return this._logistic.label; }
    get selectedTransport() {
        if(!this._selectedTransport) {
            this.resetSelectedTransport();
        }
        return this._selectedTransport;
    }

    resetSelectedTransport() {
        const flow = this._link.flow;
        if(!flow)
            return undefined;

        const transport = this._logistic.transport;
        let selectedIndex = -1;
        const lockedTransportName = this._globals.getLockedTransport(this._logistic.name);
        if(lockedTransportName) {
            selectedIndex = transport.findIndex((t) => (t.name == lockedTransportName));
        }
        if(selectedIndex < 0) {
            const index = binarySearch(transport, (t) => (t.countPerSecond >= flow));
            selectedIndex = (index < transport.length) ? index : transport.length - 1;
        }
        const selectedGameTransport = transport[selectedIndex];
        this._selectedTransport = new TransportModelImpl(
            selectedGameTransport,
            selectedIndex,
            this._link,
        );
        return this._selectedTransport;
    }
    switchSelectedTransport(offset: number) {
        const selectedTransport = this.selectedTransport;
        if(!selectedTransport)
            return;
        const transport = this._logistic.transport;
        let selectedIndex = selectedTransport.index + offset;
        if(selectedIndex < 0)
            selectedIndex = 0;
        if(selectedIndex >= transport.length)
            selectedIndex = transport.length - 1;
        const selectedGameTransport = transport[selectedIndex];
        this._selectedTransport = new TransportModelImpl(
            selectedGameTransport,
            selectedIndex,
            this._link,
        );
    }
}


export class LogisticSetModelImpl {
    private readonly _logisticMap = new Map<string, LogisticModel>();

    constructor(link?: LinkModel, logistic?: GameLogistic[]) {
        if(link && link.input?.owner && logistic) {
            for(const logisticItem of logistic) {
                const logisticModel = new LogisticModelImpl(logisticItem, link, link.input?.owner);
                this._logisticMap.set(logisticItem.name, logisticModel);
            }
        }
    }

    get logistic() { return this._logisticMap.values(); }
    get logisticCount() { return this._logisticMap.size; }
    logisticByName(name: string) { return this._logisticMap.get(name); }
    resetSelectedTransport() {
        for(const logisticModel of this.logistic) {
            logisticModel.resetSelectedTransport();
        }
    }

    private static _emptyLogisticSet = new LogisticSetModelImpl();

    static createLogisticSet(link: LinkModel, isTemporary?: boolean): LogisticSetModel {
        if(!link || isTemporary) {
            return this._emptyLogisticSet;
        }
        const gameData = link.input?.owner?.gameData;
        //should be the same input = output
        const io = gameData?.getGameItem(link.input?.name || link.output?.name || '');
        if(!gameData || !io) {
            return this._emptyLogisticSet;
        }
        const logistic = gameData.getLogistic(io);
        if(!logistic.length) {
            return this._emptyLogisticSet;
        }

        const logisticSet = new LogisticSetModelImpl(link, logistic);
        return logisticSet;
    }
}
