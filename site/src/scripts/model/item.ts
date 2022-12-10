import type {Item} from '../data/data';
import {Rect, type ReadonlyPointType} from '../geometry';
import newKey from './key-store';
import type {BlueprintModel, ScreenToClientOptions, ScreenToClientProvider} from './store';

export class ItemModelImpl implements ScreenToClientProvider {
    private readonly _owner;
    private readonly _key;
    protected readonly _item;
    private readonly _rect = new Rect();

    constructor(owner?: BlueprintModel, item?: Item, key?: string) {
        this._owner = owner;
        this._item = item;
        this._key = newKey(key);
    }

    screenToClient(point: ReadonlyPointType, options: ScreenToClientOptions = {}): ReadonlyPointType {
        if(!this._owner)
            return point;
        return this._owner.screenToClient(point, options);
    }

    get key() { return this._key; }
    get name() { return this._item?.name; }
    get label() { return this._item?.label; }
    get image() { return this._item?.image || ''; }
    get rect() { return this._rect; }
    get owner() { return this._owner; }
}
