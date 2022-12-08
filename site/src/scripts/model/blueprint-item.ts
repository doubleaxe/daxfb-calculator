import {itemCollection} from '../data-parsed';
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import type {RecipeModel} from './types';

export class BlueprintItemModelImpl extends ItemModelImpl {
    private _selectedRecipe?: RecipeModel;

    constructor(name: string) {
        super(itemCollection.getItem(name));
        const item = this._item;
        if(item?.recipes?.firstRecipe) {
            this._selectedRecipe = new RecipeModelImpl(this, item?.recipes?.firstRecipe);
        }
    }

    get selectedRecipe() { return this._selectedRecipe; }
}
