import type {Item} from '../data-parsed';
import newKey from './key-store';

export class ItemModelImpl {
    private readonly _key;
    protected readonly _item;
    public x = 0;
    public y = 0;

    constructor(item?: Item, key?: string) {
        this._item = item;
        this._key = newKey(key);
    }

    get key() { return this._key; }
    get name() { return this._item?.name; }
    get label() { return this._item?.label; }
    get image() { return this._item?.image || ''; }
}
