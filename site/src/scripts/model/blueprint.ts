/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {BlueprintItemModelImpl} from './blueprint-item';
import {LinkModelImpl} from './link';
import type {SavedBlueprint} from './saved-blueprint';
import {
    calculateItemPositions,
    normalizeItemPositions,
    type BlueprintItemModel,
    type LinkModel,
    type RecipeIOModel,
} from './store';
import {resetKeyStore} from './key-store';
import {resetOrSolveGraph} from '../graph';
import {useDebounceFn} from '@vueuse/core';
import {DEFAULT_PRECISION} from '../types';
import type {ErrorCollector} from '../error-collector';
import type {GameData} from '../data';

export class BlueprintModelImpl {
    private readonly _gameData: GameData;
    private readonly _items = new Map<string, BlueprintItemModel>();
    private readonly _links = new Map<string, LinkModel>();
    private _tempLink?: LinkModel = undefined;
    public hasCycles = false;
    private _solvePrecision = DEFAULT_PRECISION;
    private _autoSolveGraph = true;
    private _bulkUpdate = false;
    //could be used by vue to watch items added/removed
    private _itemsGenerationNumber = 0;
    private _summaryGenerationNumber = 0;
    private readonly _lockedTransport = new Map<string, string>();

    public blueprintName = '';
    getDefaultBlueprintName() {
        return `${this._gameData.gameDescription.description} New Blueprint`;
    }
    resetBlueprintName() {
        this.blueprintName = this.getDefaultBlueprintName();
    }

    constructor(_gameData: GameData) {
        this._gameData = _gameData;
        this.resetBlueprintName();
    }

    get gameData() { return this._gameData; }
    get items() { return this._items.values(); }
    itemByKey(key: string) { return this._items.get(key); }
    get links() { return this._links.values(); }
    get tempLink() { return this._tempLink; }
    get itemsGenerationNumber() { return this._itemsGenerationNumber; }
    get summaryGenerationNumber() { return this._summaryGenerationNumber; }

    get solvePrecision() { return this._solvePrecision; }
    set solvePrecision(solvePrecision: number) { this._solvePrecision = solvePrecision; this._$graphChanged(true); }
    get autoSolveGraph() { return this._autoSolveGraph; }
    set autoSolveGraph(autoSolveGraph: boolean) {
        this._autoSolveGraph = autoSolveGraph;
        if(autoSolveGraph) {
            this._$graphChanged(true);
        }
    }

    getLockedTransport(logisticName: string) { return this._lockedTransport.get(logisticName); }
    lockTransport(logisticName: string, transportName: string | undefined) {
        if(!transportName) {
            this._lockedTransport.delete(logisticName);
        } else {
            this._lockedTransport.set(logisticName, transportName);
        }
    }

    //types are compatible, just don't use instanceof
    //ReactiveBlueprintItemModel, ReactiveLinkModel are too complex and too mess to implement
    addItem(name: string) {
        const item = new BlueprintItemModelImpl(this, name);
        //invalid item
        if(!item.name)
            return item;
        this._items.set(item.key, item);
        this._$graphChanged(false, item);
        return item;
    }
    _$itemInitializationCompleted(item: BlueprintItemModel) {
        this._itemsGenerationNumber++;
    }
    _$deleteItem(item: BlueprintItemModel) {
        //if it is not linked to anything, it will not change graph
        //if it linked - _$deleteLink will cause graph update
        this._items.delete(item.key);
        this._itemsGenerationNumber++;
        this._summaryGenerationNumber++;
    }
    _$addLink(...io: RecipeIOModel[]) {
        const link = BlueprintModelImpl.newLink(io, false);
        this._links.set(link.key, link);
        link._$applyPersistentLink();
        this._$graphChanged(false, ...io.map((i) => i.ownerItem));
        return link;
    }
    _$deleteLink(link: LinkModel) {
        if(!this._links.delete(link.key))
            return;
        link._$deletePersistentLink();
        this._$graphChanged(false, link.input?.ownerItem, link.output?.ownerItem);
    }
    _$createTempLink(...io: RecipeIOModel[]) {
        if(this._tempLink) {
            throw new Error('Already have temp link');
        }
        const link = BlueprintModelImpl.newLink(io, true);
        this._tempLink = link;
        return link;
    }
    clearTempLink() {
        this._tempLink = undefined;
    }
    private static newLink(io: RecipeIOModel[], isTemporary: boolean) {
        if(io.length > 2)
            throw new Error(`Expected 2 elements, got ${io.length}`);
        const _io: {input?: RecipeIOModel; output?: RecipeIOModel} = {
            input: undefined,
            output: undefined,
        };
        for(const i of io) {
            const target: keyof(typeof _io) = i.isInput ? 'input' : 'output';
            if(_io[target])
                throw new Error('Expecting 1 input and 1 output, got duplicates');
            _io[target] = i;
        }
        return new LinkModelImpl(_io.input, _io.output, isTemporary);
    }

    clear() {
        this._clear();
        this._itemsGenerationNumber++;
        this._summaryGenerationNumber++;
    }
    private _clear() {
        resetKeyStore();
        this._items.clear();
        this._links.clear();
        this.hasCycles = false;
        this.resetBlueprintName();
    }
    save() {
        //normalize positions before saving
        const {minItemXY} = calculateItemPositions(this.items);
        const offsetBy = minItemXY.scalePoint(-1);

        const items = [...this._items.values()];
        const links = [...this._links.values()];
        const itemIndexes = new Map(items.map((item, index) => [item.key, index]));
        const savedBlueprint: SavedBlueprint = {
            i: items.map((item) => item._$save(offsetBy)),
            l: links.map((link) => link._$save(
                itemIndexes.get(link.input?.ownerItem?.key || ''),
                itemIndexes.get(link.output?.ownerItem?.key || ''),
            )),
        };
        const description = this._gameData.gameDescription;
        savedBlueprint.h = {
            g: description.shortName,
            v: description.saveVersion,
        };
        return savedBlueprint;
    }
    load(savedBlueprint: SavedBlueprint, errorCollector: ErrorCollector) {
        this._bulkUpdate = true;
        try {
            this._clear();
            this._load(savedBlueprint, errorCollector);
        } catch(err) {
            errorCollector.collectError(err);
        } finally {
            this._bulkUpdate = false;
        }
        this._$graphChanged(true);
        this._itemsGenerationNumber = 0;
    }
    private _load(savedBlueprint: SavedBlueprint, errorCollector: ErrorCollector) {
        const {compatibleSaveVersions: compatVersions} = this._gameData.gameDescription;
        if(savedBlueprint.h?.v && !compatVersions.some((v) => (v == savedBlueprint.h?.v))) {
            errorCollector.collectError(`Incompatible game version, expecting "${compatVersions.join(',')}", got "${savedBlueprint.h?.v}"`);
        }
        const itemIndexes = new Map<number, string>();
        savedBlueprint.i.forEach((i, index) => {
            const item = this.addItem(i.n);
            if(!item.name) {
                //invalid item, old/broken recipe
                errorCollector.collectError(`Invalid item id "${i.n}"`);
                return;
            }
            item._$loadItem(i, errorCollector);
            itemIndexes.set(index, item.key);
        });
        savedBlueprint.l.forEach((link) => {
            //first array item is always input, second is always output
            //the order is important, because we may connect for example generator to electric engine
            //in this case we may connect by either end
            //generator output to electric engine
            //or electric engine output to generator
            //which end is connected is determined by io order
            const inputKey = itemIndexes.get(link.l[0]);
            const outputKey = itemIndexes.get(link.l[1]);
            if(!inputKey || !outputKey) {
                //broken link
                errorCollector.collectError(`Invalid link "${link.l[0]}" => "${link.l[1]}"`);
                return;
            }
            const input = this.itemByKey(inputKey);
            const output = this.itemByKey(outputKey);
            if(!input || !output) {
                return;
            }
            const loadedLink = input._$loadLink(output, errorCollector);
            if(loadedLink) {
                loadedLink._$load(link, errorCollector);
            }
        });
        normalizeItemPositions(this.items);
        this.resetBlueprintName();
    }

    private readonly _dirtyItems = new Set<BlueprintItemModel>();
    private _calculateAll = false;
    solveGraph(manualExecution: boolean) {
        let dirtyItems: BlueprintItemModel[] = [...this._items.values()];
        if(!manualExecution && !this._calculateAll) {
            //filter, because may be already deleted
            dirtyItems = [...this._dirtyItems].filter((item) => this._items.has(item.key));
        }
        this._dirtyItems.clear();
        this._calculateAll = false;
        if(!dirtyItems.length) {
            return;
        }

        const mustSolve = manualExecution || this._autoSolveGraph;
        //if we just need to reset, and all dirty items are already reset, do nothing
        if(!mustSolve && dirtyItems.every((item) => (item.solvedCount === undefined))) {
            return;
        }

        const _bulkUpdate = this._bulkUpdate;
        this._bulkUpdate = true;
        try {
            resetOrSolveGraph(this, dirtyItems.values(), mustSolve, this._solvePrecision);
        } finally {
            this._bulkUpdate = _bulkUpdate;
        }
        this._summaryGenerationNumber++;
    }

    private debouncedSolve: (() => void) | undefined = undefined;
    _$graphChanged(immediate?: boolean, ...items: (BlueprintItemModel | undefined)[]) {
        if(this._bulkUpdate) {
            return;
        }

        //no items = update all
        if(items && items.length) {
            let haveItems = false;
            for(const item of items) {
                if(item) {
                    this._dirtyItems.add(item);
                    haveItems = true;
                }
            }
            if(!haveItems) {
                //array of undefined
                return;
            }
        } else {
            this._calculateAll = true;
        }

        if(immediate) {
            this.solveGraph(false);
        } else {
            if(!this.debouncedSolve) {
                //lazy initialize, because 'this' may be proxy in vue environment
                this.debouncedSolve = useDebounceFn(() => {
                    this.solveGraph(false);
                }, 200, {maxWait: 1000});
            }

            this.debouncedSolve();
        }
    }
}
