import {dataProvider, type Recipe} from '../data/data';
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import {
    BlueprintItemState,
    type BlueprintItemStateValues,
    type BlueprintModel,
    type RecipeIOModel,
    type RecipeModel
} from './store';

export class BlueprintItemModelImpl extends ItemModelImpl {
    private readonly _recipes;
    private _selectedRecipe?: RecipeModel;
    public isFloating = false;
    private _stateColor: BlueprintItemStateValues = BlueprintItemState.None;

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
    get stateColor() { return this._stateColor; }
    get tier() { return this._item?.tier; }

    calculateLinkState(sourceIo?: RecipeIOModel | null) {
        if(!sourceIo) {
            this._stateColor = BlueprintItemState.None;
            return;
        }
        const maybeTarget = this._selectedRecipe?.findMaybeTarget(sourceIo);
        if(!maybeTarget) {
            this._stateColor = BlueprintItemState.CannotLinkTarget;
            return;
        }
        this._stateColor = BlueprintItemState.LinkTarget;
    }
    createLink(sourceIo: RecipeIOModel) {
        const maybeTarget = this._selectedRecipe?.findMaybeTarget(sourceIo);
        if(!maybeTarget)
            return;
        this.owner?.addLink(sourceIo, maybeTarget);
    }
    selectRecipe(name: string) {
        const recipe = this._recipes.get(name);
        if(recipe) {
            this._selectedRecipe = new RecipeModelImpl(this, recipe);
        }
    }
}
