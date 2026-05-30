import { action, makeObservable, observable } from 'mobx';

import type { GameDataBase } from '../parser/index.js';
import type { CreateFactoryModel, FactoryModelBaseImpl } from './FactoryModel.js';
import type { CreateIOLinkModel, IOLinkModelBaseImpl } from './IOLinkModel.js';
import type { FactoryConnection, FactoryModelBase, IOLinkModelBase, RecipeIOModelBase } from './types.js';

export abstract class FlowChartModelBaseImpl {
    chartName = '';
    readonly gameData;

    protected readonly __items = new Map<string, FactoryModelBaseImpl>();
    protected readonly __links = new Map<string, IOLinkModelBaseImpl>();

    protected readonly __factoryConstructor: CreateFactoryModel;
    protected readonly __ioLinkConstructor: CreateIOLinkModel;

    constructor(
        gameData: GameDataBase,
        __factoryConstructor: CreateFactoryModel,
        __ioLinkConstructor: CreateIOLinkModel
    ) {
        this.__factoryConstructor = __factoryConstructor;
        this.__ioLinkConstructor = __ioLinkConstructor;
        this.gameData = gameData;
        this.resetChartName();

        makeObservable<FlowChartModelBaseImpl, '__items' | '__links'>(this, {
            chartName: observable,
            __items: observable,
            __links: observable,
            resetChartName: action,
            addItem: action,
            __deleteItem: action,
            createLink: action,
        });
    }

    get defaultChartName() {
        return `${this.gameData.description.description} New Flow Chart`;
    }
    get items(): IterableIterator<FactoryModelBase> {
        return this.__items.values();
    }
    get links(): IterableIterator<IOLinkModelBase> {
        return this.__links.values();
    }

    itemByKey(key: string): FactoryModelBase | undefined {
        return this.__items.get(key);
    }
    findIo(itemId: string, ioId: string): RecipeIOModelBase | undefined {
        const factory = this.__items.get(itemId);
        if (factory) {
            const io = factory.__getIO(ioId);
            return io;
        }
        return undefined;
    }
    findConnectable(io: RecipeIOModelBase) {
        const connectable: {
            factory: FactoryModelBase;
            io?: RecipeIOModelBase;
        }[] = [];
        for (const item of this.__items.values()) {
            if (item.itemId === io.factory.itemId) continue;
            if (item.__findAlreadyLinked(io)) continue;
            const connectableIo = item.__findConnectable(io);
            if (connectableIo) {
                connectable.push({ factory: item, io: connectableIo });
                continue;
            }
            if (item.__possibleRecipesForIo(io).length) {
                connectable.push({ factory: item });
            }
        }
        return connectable;
    }

    resetChartName() {
        this.chartName = this.defaultChartName;
    }

    addItem(key: string): FactoryModelBase {
        const item = this.__factoryConstructor(this, key);
        // invalid item
        if (!item.key) return item;
        this.__items.set(item.itemId, item);
        return item;
    }

    __deleteItem(item: FactoryModelBase) {
        this.__items.delete(item.itemId);
    }

    createLink(connection: FactoryConnection): IOLinkModelBase | undefined {
        const sourceItem = this.__items.get(connection.sourceId);
        const sourceIO = sourceItem?.__getIO(connection.sourceIOId);
        const targetItem = this.__items.get(connection.targetId);
        const targetIO = targetItem?.__getIO(connection.targetIOId);
        if (!sourceIO || !targetIO) {
            return undefined;
        }
        if (
            !!sourceIO.isInput === !!targetIO.isInput ||
            !sourceIO.isConnectable(targetIO) ||
            sourceIO.isAlreadyLinked(targetIO)
        ) {
            return undefined;
        }
        const input = sourceIO.isInput ? sourceIO : targetIO;
        const output = sourceIO.isInput ? targetIO : sourceIO;
        const link = this.__ioLinkConstructor(input, output);
        this.__links.set(link.linkId, link);
        input.__addLink(link);
        output.__addLink(link);
        return link;
    }
}
