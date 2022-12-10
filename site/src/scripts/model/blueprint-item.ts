import {dataProvider} from '../data/data';
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import type {BlueprintModel, RecipeModel} from './store';

export class BlueprintItemModelImpl extends ItemModelImpl {
    private recipes;
    private _selectedRecipe?: RecipeModel;
    public isFloating = false;

    constructor(owner: BlueprintModel, name: string) {
        super(owner, dataProvider.getItem(name));
        this.recipes = dataProvider.getRecipesForItem(this._item);
        if(this.recipes.length) {
            this._selectedRecipe = new RecipeModelImpl(this, this.recipes[0]);
        }
    }

    get selectedRecipe() { return this._selectedRecipe; }
}
