import {ref} from 'vue';
import type {Item} from '../data-parsed';

export class ItemModel {
    private _key;
    protected readonly _item;
    protected _x = ref(0);
    protected _y = ref(0);
    private static currentKey = 0;

    constructor(item?: Item, key?: string) {
        this._item = item;
        this._key = key || ('k' + ItemModel.currentKey++);
    }

    get key() { return this._key; }
    get name() { return this._item?.name; }
    get label() { return this._item?.label; }
    get image() { return this._item?.image || ''; }

    get x() { return this._x; }
    get y() { return this._y; }
}
