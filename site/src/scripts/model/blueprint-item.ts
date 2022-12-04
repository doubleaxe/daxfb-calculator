import {itemCollection} from '../data-parsed';
import type {ItemMutationObserver} from './types';
import {RecipeModel} from './recipe';
import {ItemModel} from './item';

export class BlueprintItemModel extends ItemModel {
    private _key;
    private readonly _observer: ItemMutationObserver;
    private _selectedRecipe?: RecipeModel;
    private static currentKey = 0;

    constructor(name: string, observer: ItemMutationObserver) {
        super(itemCollection.getItem(name));
        const item = this._item;
        this._key = 'k' + BlueprintItemModel.currentKey++;
        this._observer = observer;
        this._selectedRecipe = item?.recipes?.firstRecipe ? new RecipeModel(item?.recipes?.firstRecipe) : undefined;
    }

    get key() { return this._key; }

    set x(x: number) { this._observer.mutateX(this, this._x, x); this._x = x; }
    set y(y: number) { this._observer.mutateY(this, this._y, y); this._y = y; }

    get selectedRecipe() { return this._selectedRecipe; }
}
