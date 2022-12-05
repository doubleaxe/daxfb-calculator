import {itemCollection} from '../data-parsed';
import {RecipeModel} from './recipe';
import {ItemModel} from './item';

export class BlueprintItemModel extends ItemModel {
    private _selectedRecipe?: RecipeModel;

    constructor(name: string) {
        super(itemCollection.getItem(name));
        const item = this._item;
        if(item?.recipes?.firstRecipe) {
            this._selectedRecipe = new RecipeModel(this, item?.recipes?.firstRecipe);
        }
    }

    get selectedRecipe() { return this._selectedRecipe; }
}
