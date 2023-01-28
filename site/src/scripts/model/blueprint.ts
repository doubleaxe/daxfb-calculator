import {Point, Rect} from '../geometry';
import {BlueprintItemModelImpl} from './blueprint-item';
import {LinkModelImpl} from './link';
import type {SavedBlueprint} from './saved-blueprint';
import type {
    BlueprintItemModel,
    LinkModel,
    PublicPoint,
    PublicRect,
    RecipeIOModel,
} from './store';
import {resetKeyStore} from './key-store';
import {solveGraph} from '../graph';
import {useDebounceFn} from '@vueuse/core';

export class BlueprintModelImpl {
    private readonly _items = new Map<string, BlueprintItemModel>();
    private readonly _links = new Map<string, LinkModel>();
    private _tempLink?: LinkModel = undefined;
    private _maxItemXY: PublicPoint = Point.assign();
    private _boundingRect: PublicRect = Rect.assign();
    public hasCycles = false;
    private _solvePrecision = .001;
    private _autoSolveGraph = false;
    private _bulkUpdate = false;

    get items() { return this._items.values(); }
    itemByKey(key: string) { return this._items.get(key); }
    get links() { return this._links.values(); }
    get tempLink() { return this._tempLink; }

    get boundingRect() { return this._boundingRect; }
    get solvePrecision() { return this._solvePrecision; }
    set solvePrecision(solvePrecision: number) { this._solvePrecision = solvePrecision; this._$graphChanged(true); }
    get autoSolveGraph() { return this._autoSolveGraph; }
    set autoSolveGraph(autoSolveGraph: boolean) { this._autoSolveGraph = autoSolveGraph; this._$graphChanged(true); }

    //types are compatible, just don't use instanceof
    //ReactiveBlueprintItemModel, ReactiveLinkModel are too complex and too mess to implement
    addItem(name: string) {
        const item = new BlueprintItemModelImpl(this, name);
        //invalid item
        if(!item.name)
            return item;
        this._items.set(item.key, item);
        this._$graphChanged();
        return item;
    }
    _$deleteItem(item: BlueprintItemModel) {
        this._items.delete(item.key);
        this._$graphChanged();
        this._$updateXY();
    }
    _$addLink(...io: RecipeIOModel[]) {
        const link = BlueprintModelImpl.newLink(io);
        this._links.set(link.key, link);
        link._$applyPersistentLink();
        this._$graphChanged();
        return link;
    }
    _$deleteLink(link: LinkModel) {
        if(!this._links.delete(link.key))
            return;
        link._$deletePersistentLink();
        this._$graphChanged();
    }
    _$createTempLink(...io: RecipeIOModel[]) {
        if(this._tempLink) {
            throw new Error('Already have temp link');
        }
        const link = BlueprintModelImpl.newLink(io);
        this._tempLink = link;
        return link;
    }
    clearTempLink() {
        this._tempLink = undefined;
    }
    private static newLink(io: RecipeIOModel[]) {
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
        return new LinkModelImpl(_io.input, _io.output);
    }

    _$updateXY(item?: BlueprintItemModel) {
        if(this._bulkUpdate) {
            return;
        }
        if(item) {
            this._maxItemXY = this._maxItemXY.assignPoint({
                x: Math.max(this._maxItemXY.x, item.position.x),
                y: Math.max(this._maxItemXY.y, item.position.y),
            });
        } else {
            const {maxX, maxY} = [...this.items].reduce((max, {position}) => ({
                maxX: Math.max(position.x, max.maxX),
                maxY: Math.max(position.y, max.maxY),
            }), {maxX: 0, maxY: 0});
            this._maxItemXY = this._maxItemXY.assignPoint({x: maxX, y: maxY});
        }

        this._boundingRect = this._boundingRect.assignSize({
            width: Math.max(this._maxItemXY.x + 500, 2000),
            height: Math.max(this._maxItemXY.y + 500, 2000),
        });
    }

    clear() {
        this._clear();
        this._$updateXY();
    }
    private _clear() {
        resetKeyStore();
        this._items.clear();
        this._links.clear();
        this.hasCycles = false;
    }
    save() {
        const items = [...this._items.values()];
        const links = [...this._links.values()];
        const itemIndexes = new Map(items.map((item, index) => [item.key, index]));
        const savedBlueprint: SavedBlueprint = {
            i: items.map((item) => item._$save()),
            l: links.map((link) => link._$save(
                itemIndexes.get(link.input?.ownerItem?.key || ''),
                itemIndexes.get(link.output?.ownerItem?.key || ''),
            )),
        };
        return JSON.stringify(savedBlueprint);
    }
    load(savedBlueprintJson: string) {
        const savedBlueprint: SavedBlueprint = JSON.parse(savedBlueprintJson);
        this._bulkUpdate = true;
        try {
            this._clear();
            this._load(savedBlueprint);
        } finally {
            this._bulkUpdate = false;
        }
        this._$graphChanged(true);
        this._$updateXY();
    }
    private _load(savedBlueprint: SavedBlueprint) {
        const itemIndexes = new Map<number, string>();
        savedBlueprint.i.forEach((i, index) => {
            const item = this.addItem(i.n);
            if(!item.name) {
                //invalid item, old/broken recipe
                //TODO - show errors and status
                return;
            }
            item._$loadItem(i);
            itemIndexes.set(index, item.key);
        });
        savedBlueprint.l.forEach((link) => {
            const itemKey1 = itemIndexes.get(link.l[0]);
            const itemKey2 = itemIndexes.get(link.l[1]);
            if(!itemKey1 || !itemKey2) {
                //broken link
                //TODO - show errors and status
                return;
            }
            const item1 = this.itemByKey(itemKey1);
            const item2 = this.itemByKey(itemKey2);
            if(!item1 || !item2) {
                return;
            }
            item1._$loadLink(item2);
        });
    }
    solveGraph(items?: IterableIterator<BlueprintItemModel>) {
        if(!items && !this._items.size)
            return;
        if(!items)
            items = this._items.values();
        const _bulkUpdate = this._bulkUpdate;
        this._bulkUpdate = true;
        try {
            solveGraph(this, items, this._solvePrecision);
        } finally {
            this._bulkUpdate = _bulkUpdate;
        }
    }

    private debouncedSolve: (() => void) | undefined = undefined;
    _$graphChanged(immediate?: boolean) {
        if(!this._autoSolveGraph || this._bulkUpdate) {
            return;
        }

        if(immediate) {
            this.solveGraph();
        } else {
            if(!this.debouncedSolve) {
                //lazy initialize, because 'this' may be proxy in vue environment
                this.debouncedSolve = useDebounceFn(() => {
                    this.solveGraph();
                }, 200, {maxWait: 1000});
            }

            this.debouncedSolve();
        }
    }
}
