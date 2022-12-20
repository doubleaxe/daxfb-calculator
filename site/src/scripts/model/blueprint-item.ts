import {dataProvider, type Recipe} from '../data/data';
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import type {
    BlueprintModel,
    RecipeIOModel,
    RecipeModel
} from './store';
import {BlueprintItemState, type BlueprintItemStateValues} from '../types';

export class BlueprintItemModelImpl extends ItemModelImpl {
    private readonly _recipes;
    private _selectedRecipe?: RecipeModel;
    public isFloating = false;
    private _state: BlueprintItemStateValues = BlueprintItemState.None;

    constructor(owner: BlueprintModel, name: string) {
        super(owner, dataProvider.getItem(name));
        this._recipes = new Map<string, Recipe>(
            dataProvider.getRecipesForItem(this._item).map((r) => [r.name, r])
        );
        if(this._recipes.size) {
            this._selectedRecipe = new RecipeModelImpl(this, this._recipes.values().next().value);
        }
    }

    get selectedRecipe() { return this._selectedRecipe; }
    get recipes() { return this._recipes.values(); }
    get state() { return this._state; }
    get tier() { return this._item?.tier; }

    calculateLinkState(sourceIo?: RecipeIOModel | null) {
        if(!sourceIo) {
            this._state = BlueprintItemState.None;
            return;
        }
        const maybeTarget = this._selectedRecipe?.findSimilarIo(sourceIo, true);
        if(!maybeTarget) {
            this._state = BlueprintItemState.CannotLinkTarget;
            return;
        }
        if(maybeTarget.isAlreadyLinked(sourceIo)) {
            this._state = BlueprintItemState.LinkAlreadyExists;
            return;
        }
        this._state = BlueprintItemState.CanLinkTarget;
    }
    createLink(sourceIo: RecipeIOModel) {
        const maybeTarget = this._selectedRecipe?.findSimilarIo(sourceIo, true);
        if(!maybeTarget)
            return;
        this.owner?.addLink(sourceIo, maybeTarget);
    }
    selectRecipe(name: string) {
        const recipe = this._recipes.get(name);
        if(!recipe)
            return;
        const oldRecipe = this._selectedRecipe;
        const newRecipe = new RecipeModelImpl(this, recipe);
        if(oldRecipe?.name == newRecipe.name)
            return;
        //try to persist similar links from old recipe to new one
        oldRecipe?.copySimilarLinksTo(newRecipe);
        oldRecipe?.deleteAllLinks();
        this._selectedRecipe = newRecipe;
    }
}
