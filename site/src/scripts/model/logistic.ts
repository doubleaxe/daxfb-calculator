/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import type {GameLogistic, GameLogisticTransport} from '#types/game-data';
import {binarySearch} from '../util';
import type {LinkModel, LogisticModel, LogisticSetModel, TransportModel} from './store';


export class TransportModelImpl {
    private readonly _transport: GameLogisticTransport;
    private readonly _flow: number;
    private readonly _count: number;

    constructor(transport: GameLogisticTransport, flow: number) {
        this._transport = transport;
        this._flow = flow;
        this._count = Math.ceil(flow / transport.countPerSecond);
    }

    get flow() { return this._flow; }
    get transport() { return this._transport; }
    get count() { return this._count; }
    get countPerSecond() { return this._transport.countPerSecond; }
}


export class LogisticModelImpl {
    private readonly _logistic: GameLogistic;
    private _selectedTransport?: GameLogisticTransport;
    private readonly _link: LinkModel;
    private _cachedTransport?: TransportModel;

    constructor(_logistic: GameLogistic, _link: LinkModel) {
        this._logistic = _logistic;
        this._link = _link;
    }

    selectTransport(transportName: string | undefined) {
        if(transportName) {
            const selectedTransport = this._logistic.transport.find((t) => (t.name == transportName));
            if(!selectedTransport) {
                throw new Error(`Transport ${transportName} not found, for logistic ${this._logistic.name}`);
            }
            this._selectedTransport = selectedTransport;
        } else {
            this._selectedTransport = undefined;
        }
    }
    get selectedTransport() { return this._selectedTransport; }
    get transport() { return this._logistic.transport; }
    get name() { return this._logistic.name; }

    calculateTransport() {
        const flow = this._link.flow;
        if(!flow)
            return undefined;
        if(this._cachedTransport?.flow === flow)
            return this._cachedTransport;

        let selectedTransport = this._selectedTransport;
        if(!selectedTransport) {
            const transport = this._logistic.transport;
            const index = binarySearch(transport, (t) => (t.countPerSecond >= flow));
            selectedTransport = (index < transport.length) ? transport[index] : transport[transport.length - 1];
        }
        this._cachedTransport = new TransportModelImpl(selectedTransport, flow);
        return this._cachedTransport;
    }
}


export class LogisticSetModelImpl {
    private readonly _logisticMap = new Map<string, LogisticModel>();

    constructor(link?: LinkModel, logistic?: GameLogistic[]) {
        if(link && logistic) {
            for(const logisticItem of logistic) {
                const logisticModel = new LogisticModelImpl(logisticItem, link);
                this._logisticMap.set(logisticItem.name, logisticModel);
            }
        }
    }

    get logistic() { return this._logisticMap.values(); }
    get logisticCount() { return this._logisticMap.size; }
    logisticByName(name: string) { return this._logisticMap.get(name); }

    selectTransport(logisticName: string, transportName: string | undefined) {
        const logisticModel = this._logisticMap.get(logisticName);
        if(!logisticModel) {
            throw new Error(`Logistic ${logisticName} not found`);
        }
        logisticModel.selectTransport(transportName);
    }

    private static _emptyLogisticSet = new LogisticSetModelImpl();

    static createLogisticSet(link: LinkModel, isTemporary?: boolean): LogisticSetModel {
        if(!link || isTemporary) {
            return this._emptyLogisticSet;
        }
        const gameData = link.input?.owner?.gameData;
        //should be the same input = output
        const io = gameData?.gameItemsMap?.get(link.input?.name || link.output?.name || '');
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
