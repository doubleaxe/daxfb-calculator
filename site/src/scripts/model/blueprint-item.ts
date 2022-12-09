import {dataProvider} from '../data/data';
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import type {RecipeModel} from './store';

export class BlueprintItemModelImpl extends ItemModelImpl {
    private recipes;
    private _selectedRecipe?: RecipeModel;

    constructor(name: string) {
        super(dataProvider.getItem(name));
        this.recipes = dataProvider.getRecipesForItem(this._item);
        if(this.recipes.length) {
            this._selectedRecipe = new RecipeModelImpl(this, this.recipes[0]);
        }
    }

    get selectedRecipe() { return this._selectedRecipe; }
}
