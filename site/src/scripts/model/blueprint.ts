import {reactive, watch} from 'vue';
import {
    Point,
    Rect,
    type ReadonlyPointType,
    type ReadonlyRectType
} from '../geometry';
import {BlueprintItemModelImpl} from './blueprint-item';
import {LinkModelImpl} from './link';
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

    get items() { return this._items.values(); }
    itemByKey(key: string) { return this._items.get(key); }
    get links() { return this._links.values(); }
    get tempLinks() { return this._tempLinks[Symbol.iterator](); }

    get boundingRect(): ReadonlyRectType { return this._boundingRect; }

    //types are compatible, just don't use instanceof
    //ReactiveBlueprintItemModel, ReactiveLinkModel are too complex and too mess to implement
    addItem(name: string) {
        const item = reactive(new BlueprintItemModelImpl(this, name));
        this._items.set(item.key, item);
        watch([() => item.rect.x, () => item.rect.y], this._updateXY.bind(this));
        return item;
    }
    addLink(...io: RecipeIOModel[]) {
        const link = BlueprintModelImpl.newLink(io);
        this._links.set(link.key, link);
        link.applyPersistentLink();
        return link;
    }
    deleteLink(link: LinkModel) {
        if(!this._links.delete(link.key))
            return;
        link.deletePersistentLink();
    }
    createTempLink(...io: RecipeIOModel[]) {
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
        if(this.updateOffsetPositionCallback)
            throw new Error('Callback already registered');
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
}
