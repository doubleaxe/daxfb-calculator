import {dataProvider, type Recipe} from '../data/data';
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import type {
    BlueprintItemModel,
    BlueprintModel,
    RecipeIOModel,
    RecipeModel
} from './store';
import {BlueprintItemState, type BlueprintItemStateValues} from '../types';
import type {SavedItem} from './saved-blueprint';

export class BlueprintItemModelImpl extends ItemModelImpl {
    private readonly _recipes;
    private _selectedRecipe?: RecipeModel;
    public isFloating = false;
    private _count = 1;
    private _solvedCount: number | undefined = undefined;
    private _state: BlueprintItemStateValues = BlueprintItemState.None;
    public partOfCycle = false;

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
    get count() { return this._count; }
    get solvedCount() { return this._solvedCount; }

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
        this.owner?._$addLink(sourceIo, maybeTarget);
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
        oldRecipe?._$copySimilarLinksTo(newRecipe);
        oldRecipe?._$deleteAllLinks();
        this._selectedRecipe = newRecipe;
    }
    setCount(count: number) {
        this._count = count;
    }
    setSolvedCount(solvedCount?: number) {
        this._solvedCount = solvedCount;
    }
    deleteAllLinks() {
        this._selectedRecipe?._$deleteAllLinks();
    }
    deleteThis() {
        this._selectedRecipe?._$deleteAllLinks();
        this.owner?._$deleteItem(this);
    }
    _$save(): SavedItem {
        return {
            n: this._item?.name || '',
            p: [Math.round(this.rect.x), Math.round(this.rect.y)],
            r: this._selectedRecipe?.name || '',
            c: (this._count == 1) ? undefined : this._count,
        };
    }
    _$loadItem(i: SavedItem) {
        //TODO - show errors and status for invalid recipe
        this.selectRecipe(i.r);
        this.rect.assignPoint({
            x: i.p[0],
            y: i.p[1],
        });
        this.setCount(i.c || 1);
    }
    _$loadLink(sourceItem: BlueprintItemModel) {
        //TODO - show errors and status for invalid link
        const sourceIoArray = sourceItem.selectedRecipe?.items;
        if(!sourceIoArray)
            return;
        for(const sourceIo of sourceIoArray) {
            const maybeTarget = this._selectedRecipe?.findSimilarIo(sourceIo, true);
            if(maybeTarget) {
                this.owner?._$addLink(sourceIo, maybeTarget);
                break;
            }
        }
    }
}
