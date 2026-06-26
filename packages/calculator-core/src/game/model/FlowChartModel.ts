import { action, makeObservable, observable } from 'mobx';
import { createNanoEvents, type Emitter } from 'nanoevents';
import { debounce } from 'perfect-debounce';

import type { GameDataBase } from '../parser/index.js';
import type { CreateFactoryModel, FactoryModelBaseImpl } from './FactoryModel.js';
import type { FlowChartEventsBase } from './FlowChartEvents.js';
import type { CreateIOLinkModel, IOLinkModelBaseImpl } from './IOLinkModel.js';
import type { RecipeIOModelBaseImpl } from './RecipeIOModel.js';
import type { FactoryConnection, FactoryModelBase, IOLinkModelBase, RecipeIOModelBase } from './types.js';

export abstract class FlowChartModelBaseImpl {
    private __events: Emitter<FlowChartEventsBase>;
    chartName = '';
    readonly gameData;

    protected readonly __items = new Map<string, FactoryModelBaseImpl>();
    protected __itemsGeneration = 0;
    protected readonly __links = new Map<string, IOLinkModelBaseImpl>();
    protected __linksGeneration = 0;

    protected readonly __factoryConstructor: CreateFactoryModel;
    protected readonly __ioLinkConstructor: CreateIOLinkModel;

    protected __solveFrozen = false;
    private __changedItems: FactoryModelBaseImpl[] = [];
    private __solveEntireGraph = false;

    constructor(
        gameData: GameDataBase,
        __factoryConstructor: CreateFactoryModel,
        __ioLinkConstructor: CreateIOLinkModel
    ) {
        this.__events = createNanoEvents<FlowChartEventsBase>();
        this.__factoryConstructor = __factoryConstructor;
        this.__ioLinkConstructor = __ioLinkConstructor;
        this.gameData = gameData;
        this.resetChartName();

        makeObservable<FlowChartModelBaseImpl, '__items' | '__itemsGeneration' | '__links' | '__linksGeneration'>(
            this,
            {
                chartName: observable,
                __items: observable,
                __itemsGeneration: observable,
                __links: observable,
                __linksGeneration: observable,
                resetChartName: action,
                addItem: action,
                __deleteItem: action,
                createLinkAuto: action,
                createLink: action,
                __createLink: action,
                __deleteLink: action,
                __requestSolveGraph: action,
                __solveGraph: action,
            }
        );
    }

    get events(): Emitter<FlowChartEventsBase> {
        return this.__events;
    }

    get defaultChartName() {
        return `${this.gameData.description.description} New Flow Chart`;
    }
    get items(): IterableIterator<FactoryModelBase> {
        return this.__items.values();
    }
    get itemsGeneration() {
        return this.__itemsGeneration;
    }
    get links(): IterableIterator<IOLinkModelBase> {
        return this.__links.values();
    }
    get linksGeneration() {
        return this.__linksGeneration;
    }

    itemByKey(key: string): FactoryModelBase | undefined {
        return this.__items.get(key);
    }
    findIo(itemId: string, ioId: string): RecipeIOModelBase | undefined {
        const factory = this.__items.get(itemId);
        if (factory) {
            const io = factory.__getIOById(ioId);
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
        this.__requestSolveGraph([item]);
        this.__itemsGeneration++;
        return item;
    }

    __deleteItem(item: FactoryModelBaseImpl) {
        //if it is not linked to anything, it will not change graph
        //if it linked - __deleteLink will cause graph update
        this.__items.delete(item.itemId);
        this.__itemsGeneration++;
    }

    linkByKey(key: string): IOLinkModelBase | undefined {
        return this.__links.get(key);
    }
    createLinkAuto(sourceId: string, sourceIOId: string, targetId: string): IOLinkModelBase | undefined {
        const sourceItem = this.__items.get(sourceId);
        const sourceIO = sourceItem?.__getIOById(sourceIOId);
        const targetItem = this.__items.get(targetId);
        if (!sourceItem || !sourceIO || !targetItem) {
            return undefined;
        }
        const recipes = targetItem.__possibleRecipesForIo(sourceIO);
        const recipe = recipes[0];
        if (!recipe) return undefined;
        targetItem.selectRecipe(recipe);
        const targetIO = targetItem.__getIOByKey(sourceIO.key ?? '');
        if (!targetIO) return undefined;
        return this.__createLink(sourceItem, sourceIO, targetItem, targetIO, true);
    }

    createLink(connection: FactoryConnection, revertIfPossible?: boolean): IOLinkModelBase | undefined {
        const sourceItem = this.__items.get(connection.sourceId);
        const sourceIO = sourceItem?.__getIOById(connection.sourceIOId);
        const targetItem = this.__items.get(connection.targetId);
        const targetIO = targetItem?.__getIOById(connection.targetIOId);
        if (!sourceItem || !sourceIO || !targetItem || !targetIO) {
            return undefined;
        }
        return this.__createLink(sourceItem, sourceIO, targetItem, targetIO, revertIfPossible);
    }

    __createLink(
        sourceItem: FactoryModelBaseImpl,
        sourceIO: RecipeIOModelBaseImpl,
        targetItem: FactoryModelBaseImpl,
        targetIO: RecipeIOModelBaseImpl,
        revertIfPossible?: boolean
    ): IOLinkModelBase | undefined {
        if (!!sourceIO.isInput === !!targetIO.isInput || !sourceIO.isConnectable(targetIO)) {
            return undefined;
        }
        const existingLink = sourceIO.__findAlreadyLinked(targetIO);
        if (existingLink) {
            if (revertIfPossible) {
                this.__links.delete(existingLink.linkId);
                sourceIO.__deleteLink(existingLink.linkId);
                targetIO.__deleteLink(existingLink.linkId);
                this.__requestSolveGraph([sourceItem, targetItem]);
                this.__linksGeneration++;
            }
            return undefined;
        }
        const input = sourceIO.isInput ? sourceIO : targetIO;
        const output = sourceIO.isInput ? targetIO : sourceIO;
        const link = this.__ioLinkConstructor(input, output);
        this.__links.set(link.linkId, link);
        input.__addLink(link);
        output.__addLink(link);
        this.__requestSolveGraph([sourceItem, targetItem]);
        this.__linksGeneration++;
        return link;
    }

    __deleteLink(link: IOLinkModelBaseImpl, changedItems: FactoryModelBaseImpl[] | undefined) {
        this.__links.delete(link.linkId);
        this.__requestSolveGraph(changedItems);
        this.__linksGeneration++;
    }

    requestSolveGraph() {
        this.__requestSolveGraph(undefined);
    }

    __requestSolveGraph(changedItems: (FactoryModelBaseImpl | undefined)[] | undefined) {
        if (this.__solveFrozen) return;

        if (changedItems) {
            this.__changedItems = this.__changedItems.concat(changedItems.filter((item) => !!item));
            this.__debouncedSolveGraph().catch(() => {});
            return;
        }

        this.__changedItems = [];
        this.__solveEntireGraph = true;
        this.__debouncedSolveGraph.flush()?.catch(() => {});
    }
    __debouncedSolveGraph = debounce(() => {
        this.__solveGraph();
    }, 200);
    __solveGraph() {
        let changedItems = this.__changedItems;
        const solveEntireGraph = this.__solveEntireGraph;
        this.__changedItems = [];
        this.__solveEntireGraph = false;
        if (!solveEntireGraph) {
            //filter, because may be already deleted
            changedItems = changedItems.filter((item) => this.__items.has(item.itemId));
            if (!changedItems.length) return;
        }

        const solveFrozen = this.__solveFrozen;
        this.__solveFrozen = true;
        try {
            this.__solveGraphInternal(changedItems);
        } finally {
            this.__solveFrozen = solveFrozen;
        }
    }
    __solveGraphInternal(_changedItems: FactoryModelBaseImpl[]) {
        this.events.emit('solveGraph', _changedItems);
    }
}
