import type {Item} from '../data/data';
import {Point} from '../geometry';
import newKey from './key-store';
import type {BlueprintModel} from './store';

export class ItemModelImpl {
    private readonly _owner;
    private readonly _key;
    protected readonly _item;
    private readonly _pos = new Point();

    constructor(owner?: BlueprintModel, item?: Item, key?: string) {
        this._owner = owner;
        this._item = item;
        this._key = newKey(key);
    }

    get owner() { return this._owner; }
    get key() { return this._key; }
    get name() { return this._item?.name; }
    get label() { return this._item?.label; }
    get image() { return this._item?.image || ''; }
    get pos() { return this._pos; }
}
