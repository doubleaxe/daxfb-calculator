import {reactive, watch} from 'vue';
import {
    Point,
    Rect,
    type ReadonlyPointType,
    type ReadonlyRectType
} from '../geometry';
import {BlueprintItemModelImpl} from './blueprint-item';
import {LinkModelImpl} from './link';
import type {SavedBlueprint} from './saved-blueprint';
import type {
    BlueprintItemModel,
    LinkModel,
    RecipeIOModel,
    ScreenToClientOptions,
    ScreenToClientProvider,
    UpdateOffsetPositionCallback
} from './store';

export class BlueprintModelImpl implements ScreenToClientProvider {
    private readonly _items = new Map<string, BlueprintItemModel>();
    private readonly _links = new Map<string, LinkModel>();
    private readonly _tempLinks: LinkModel[] = [];
    private _maxItemXY = new Point();
    private _boundingRect = new Rect();
    private updateOffsetPositionCallback: UpdateOffsetPositionCallback | undefined;
    public hasCycles = false;

    get items() { return this._items.values(); }
    itemByKey(key: string) { return this._items.get(key); }
    get links() { return this._links.values(); }
    get tempLinks() { return this._tempLinks[Symbol.iterator](); }

    get boundingRect(): ReadonlyRectType { return this._boundingRect; }

    //types are compatible, just don't use instanceof
    //ReactiveBlueprintItemModel, ReactiveLinkModel are too complex and too mess to implement
    addItem(name: string) {
        const item = reactive(new BlueprintItemModelImpl(this, name));
        //invalid item
        if(!item.name)
            return item;
        this._items.set(item.key, item);
        watch([() => item.rect.x, () => item.rect.y], this._updateXY.bind(this));
        return item;
    }
    _$deleteItem(item: BlueprintItemModel) {
        this._items.delete(item.key);
    }
    _$addLink(...io: RecipeIOModel[]) {
        const link = BlueprintModelImpl.newLink(io);
        this._links.set(link.key, link);
        link._$applyPersistentLink();
        return link;
    }
    _$deleteLink(link: LinkModel) {
        if(!this._links.delete(link.key))
            return;
        link._$deletePersistentLink();
    }
    _$createTempLink(...io: RecipeIOModel[]) {
        const link = BlueprintModelImpl.newLink(io);
        this._tempLinks.push(link);
        return link;
    }
    clearTempLinks() {
        this._tempLinks.splice(0, this._tempLinks.length);
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
        return reactive(new LinkModelImpl(_io.input, _io.output));
    }

    //basically we cannot watch window move (relayout) events
    //so we should update offset every time we would need it
    //also automatically updated on create and on scroll
    requestUpdateOffsetPosition() {
        if(this.updateOffsetPositionCallback) {
            this._boundingRect.assignPoint(this.updateOffsetPositionCallback());
        }
    }
    registerUpdateOffsetPosition(callback: UpdateOffsetPositionCallback) {
        if(this.updateOffsetPositionCallback) {
            console?.log('Callback already registered');
        }
        this.updateOffsetPositionCallback = callback;
    }
    screenToClient(point: ReadonlyPointType, {isPassive}: ScreenToClientOptions = {}): ReadonlyPointType {
        if(!isPassive)
            this.requestUpdateOffsetPosition();
        return new Point(point).offsetBy(this._boundingRect, -1);
    }
    private _updateXY([newX, newY]: number[]) {
        const maxItemXY = this._maxItemXY;
        if(newX > maxItemXY.x)
            maxItemXY.x = newX;
        if(newY > maxItemXY.y)
            maxItemXY.y = newY;

        this._boundingRect.width = Math.max(maxItemXY.x + 500, 2000);
        this._boundingRect.height = Math.max(maxItemXY.y + 500, 2000);
    }

    clear() {
        this._items.clear();
        this._links.clear();
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
            ))
        };
        return JSON.stringify(savedBlueprint);
    }
    load(savedBlueprintJson: string) {
        const savedBlueprint: SavedBlueprint = JSON.parse(savedBlueprintJson);
        this.clear();
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
}
