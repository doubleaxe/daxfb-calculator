import type {Item} from '../data-parsed';
import type {ItemModelInterface} from './types';

export class ItemModel implements ItemModelInterface {
    protected readonly _item;
    protected _x = 0;
    protected _y = 0;

    constructor(item?: Item) {
        this._item = item;
    }

    get name() { return this._item?.name; }
    get image() { return this._item?.image || ''; }

    get x() { return this._x; }
    set x(x) { this._x = x; }
    get y() { return this._y; }
    set y(y) { this._y = y; }
}
