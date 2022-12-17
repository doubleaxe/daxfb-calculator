import {dataProvider} from '../data/data';
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
    private recipes;
    private _selectedRecipe?: RecipeModel;
    public isFloating = false;
    private _stateColor: BlueprintItemStateValues = BlueprintItemState.None;

    constructor(owner: BlueprintModel, name: string) {
        super(owner, dataProvider.getItem(name));
        this.recipes = dataProvider.getRecipesForItem(this._item);
        if(this.recipes.length) {
            this._selectedRecipe = new RecipeModelImpl(this, this.recipes[0]);
        }
    }

    get selectedRecipe() { return this._selectedRecipe; }
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
}
