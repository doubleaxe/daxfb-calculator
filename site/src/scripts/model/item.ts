/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItem} from '#types/game-data';
import {newKey} from './key-store';
import type {BlueprintModel} from './store';

export class ItemModelImpl {
    private readonly _owner;
    private readonly _key;
    protected readonly _item;

    constructor(owner?: BlueprintModel, item?: GameItem, key?: string) {
        this._owner = owner;
        this._item = item;
        this._key = newKey(key);
    }

    _$getItem() { return this._item; }
    get key() { return this._key; }
    get name() { return this._item?.name; }
    get label() { return this._item?.label; }
    get image() { return this._item?.image || ''; }
    get type() { return this._item?.type; }
    get owner() { return this._owner; }
}
