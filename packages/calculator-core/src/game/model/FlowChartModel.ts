import { createNanoEvents, type Emitter } from 'nanoevents';
import { debounce } from 'perfect-debounce';

import type { ErrorCollector } from '#core/utils/ErrorCollector.js';

import type { FlowChartAction } from '../actions/index.js';
import { useSolveGraphSingleton } from '../graph/Solver.js';
import type { GameDataBase } from '../parser/index.js';
import type { CreateFactoryModel, FactoryModelBaseImpl } from './FactoryModel.js';
import type { FlowChartEventsBase } from './FlowChartEvents.js';
import { createFlowChartHelpers, type FlowChartHelpersBase } from './internal/FlowChartHelpers.js';
import { resetIdStore } from './internal/internal.js';
import type { SerializedFlowChart } from './internal/ModelSerialized.js';
import type { CreateIOLinkModel, IOLinkModelBaseImpl } from './IOLinkModel.js';
import type { FactorySnapshotBase, IOLinkSnapshotBase } from './ModelSnapshot.js';
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
    protected __helpersInstance: FlowChartHelpersBase | undefined;

    protected __solveFrozen = false;
    protected __changedItems: FactoryModelBaseImpl[] = [];
    protected __solveEntireGraph = false;
    protected __solver = useSolveGraphSingleton();

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
    }

    get __helpers() {
        if (this.__helpersInstance) return this.__helpersInstance;
        this.__helpersInstance = createFlowChartHelpers(this);
        return this.__helpersInstance;
    }
    get __snapshotFactory() {
        return this.__helpers.snapshotFactory;
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

    itemById(itemId: string): FactoryModelBase | undefined {
        return this.__itemById(itemId);
    }
    __itemById(itemId: string) {
        return this.__items.get(itemId);
    }
    findIo(itemId: string, ioId: string): RecipeIOModelBase | undefined {
        return this.__findIo(itemId, ioId);
    }
    __findIo(itemId: string, ioIdOrKey: string, byIoKey?: boolean) {
        const factory = this.__items.get(itemId);
        if (factory) {
            const io = byIoKey ? factory.__getIOByKey(ioIdOrKey) : factory.__getIOById(ioIdOrKey);
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

    setChartName(name: string): FlowChartAction {
        const nameOld = this.chartName;
        return {
            undo: () => {
                this.chartName = nameOld;
            },
            redo: () => {
                this.chartName = name;
            },
        };
    }

    resetChartName() {
        this.chartName = this.defaultChartName;
    }

    addItem(key: string): FactoryModelBase {
        return this.__addItem(key);
    }
    __addItem(key: string, snapshot?: FactorySnapshotBase): FactoryModelBaseImpl {
        const item = this.__factoryConstructor(this, key, snapshot);
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

    linkById(linkId: string): IOLinkModelBase | undefined {
        return this.__links.get(linkId);
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
        return this.__createLink0(connection, revertIfPossible);
    }

    __createLink0(connection: FactoryConnection, revertIfPossible?: boolean, snapshot?: IOLinkSnapshotBase) {
        const sourceItem = this.__items.get(connection.sourceId);
        const sourceIO = sourceItem?.__getIOById(connection.sourceIOId);
        const targetItem = this.__items.get(connection.targetId);
        const targetIO = targetItem?.__getIOById(connection.targetIOId);
        if (!sourceItem || !sourceIO || !targetItem || !targetIO) {
            return undefined;
        }
        return this.__createLink(sourceItem, sourceIO, targetItem, targetIO, revertIfPossible, snapshot);
    }

    __createLink(
        sourceItem: FactoryModelBaseImpl,
        sourceIO: RecipeIOModelBaseImpl,
        targetItem: FactoryModelBaseImpl,
        targetIO: RecipeIOModelBaseImpl,
        revertIfPossible?: boolean,
        snapshot?: IOLinkSnapshotBase
    ) {
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
        const link = this.__ioLinkConstructor(input, output, snapshot);
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

    clear() {
        this.__clear();
        this.__itemsGeneration++;
        this.__linksGeneration++;
    }
    protected __clear() {
        resetIdStore();
        this.__items.clear();
        this.__links.clear();
        this.resetChartName();
    }

    save() {
        const snapshot = this.__saveToSnapshot();
        const serialized = this.__helpers.snapshotToSerializedCompactForm.toSerializedCompactForm(snapshot);
        return serialized;
    }

    __saveToSnapshot() {
        const snapshot = this.__snapshotFactory.newFlowChartSnapshot({
            chartName: this.chartName,
            items: [...this.__items.values()].map((item) => item.__saveToSnapshot()),
        });
        return snapshot;
    }

    load(serialized: SerializedFlowChart, errorCollector: ErrorCollector) {
        this.__solveFrozen = true;
        try {
            this.__clear();
            this.__load(serialized, errorCollector);
        } catch (err) {
            errorCollector.collectError(err);
        } finally {
            this.__solveFrozen = false;
        }
        this.requestSolveGraph();
        this.__itemsGeneration++;
        this.__linksGeneration++;
    }
    protected __load(serialized: SerializedFlowChart, errorCollector: ErrorCollector) {
        const { compatibleSaveVersions: compatVersions } = this.gameData.description;
        if (serialized.h?.v && !compatVersions.some((v) => v === serialized.h?.v)) {
            errorCollector.collectError(
                `Incompatible game version, expecting "${compatVersions.join(',')}", got "${serialized.h?.v}"`
            );
        }
        const itemIndexes = new Map<number, string>();
        serialized.i.forEach((i, index) => {
            const item = this.__addItem(i.n);
            if (!item.name) {
                //invalid item, old/broken recipe
                errorCollector.collectError(`Invalid item id "${i.n}"`);
                return;
            }
            item.__loadItem(i, errorCollector);
            itemIndexes.set(index, item.key ?? '');
        });
        serialized.l.forEach((link) => {
            //first array item is always input, second is always output
            //the order is important, because we may connect for example generator to electric engine
            //in this case we may connect by either end
            //generator output to electric engine
            //or electric engine output to generator
            //which end is connected is determined by io order
            const inputKey = itemIndexes.get(link.l[0] ?? 0);
            const outputKey = itemIndexes.get(link.l[1] ?? 0);
            if (!inputKey || !outputKey) {
                //broken link
                errorCollector.collectError(`Invalid link "${link.l[0]}" => "${link.l[1]}"`);
                return;
            }
            const input = this.__items.get(inputKey);
            const output = this.__items.get(outputKey);
            if (!input || !output) {
                return;
            }
            input.__loadLink(link, output, errorCollector);
        });
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
    protected __debouncedSolveGraph = debounce(() => {
        this.__solveGraph();
    }, 200);
    protected __solveGraph() {
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
    protected __solveGraphInternal(_changedItems: FactoryModelBaseImpl[]) {
        this.events.emit('solveGraph', _changedItems);
        this.__solver(_changedItems.length ? _changedItems : this.__items.values()).catch(() => {});
    }
}
