/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import type {
    BlueprintItemModel,
    BlueprintModel,
    RecipeIOModel,
    RecipeModel,
} from './store';
import {BlueprintItemState, type BlueprintItemStateValues} from '../types';
import type {SavedItem} from './saved-blueprint';
import {Rect, type PublicRect, type ReadonlyPointType} from '../geometry';
import type {ErrorCollector} from '../error-collector';

export class BlueprintItemModelImpl extends ItemModelImpl {
    private _rect: PublicRect = Rect.assign();
    private readonly _recipesDictionary;
    private readonly _recipes;
    private _selectedRecipe?: RecipeModel;
    private _count = 1;
    private _solvedCount: number | undefined = undefined;
    private _state: BlueprintItemStateValues = BlueprintItemState.None;
    public partOfCycle = false;
    public isFlipped = false;
    private _isLocked = false;
    private _initializationCompleted = false;

    constructor(owner: BlueprintModel, name: string) {
        super(owner, owner.gameData.getGameItem(name));
        this._recipesDictionary = owner.gameData.getItemRecipeDictionary(this._item);
        this._recipes = this._recipesDictionary.recipesMap;
        if(this._recipes.size) {
            this._selectedRecipe = new RecipeModelImpl(this, this._recipes.values().next().value);
        }
    }

    get rect(): PublicRect { return this._rect; }
    setRect(rect: PublicRect) {
        if(!this._rect.isEqual(rect)) {
            this._rect = rect;
        }
    }
    get selectedRecipe() { return this._selectedRecipe; }
    get recipes() { return this._recipes.values(); }
    get recipesCount() { return this._recipes.size; }
    get state() { return this._state; }
    get count() { return this._count; }
    get solvedCount() { return this._solvedCount; }
    get isLocked() { return this._isLocked; }
    setLocked(isLocked: boolean) { this._isLocked = isLocked; this.owner?._$graphChanged(); }
    initializationCompleted() {
        if(!this._initializationCompleted) {
            this._initializationCompleted = true;
            this.owner?._$itemInitializationCompleted(this);
        }
    }

    calculateLinkState(sourceIo?: RecipeIOModel | null): BlueprintItemStateValues {
        if(!sourceIo) {
            return BlueprintItemState.None;
        }
        const maybeTarget = this._selectedRecipe?.findSimilarIo(sourceIo, true);
        if(maybeTarget) {
            if(maybeTarget.isAlreadyLinked(sourceIo)) {
                return BlueprintItemState.LinkAlreadyExists;
            }
            return BlueprintItemState.CanLinkTarget;
        }
        if(this.possibleRecipeForIo(sourceIo)) {
            return BlueprintItemState.CanLinkWithRecipeChange;
        }
        return BlueprintItemState.CannotLinkTarget;
    }
    updateLinkState(sourceIo?: RecipeIOModel | null) {
        this._state = this.calculateLinkState(sourceIo);
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
            return false;
        const oldRecipe = this._selectedRecipe;
        const newRecipe = new RecipeModelImpl(this, recipe);
        if(oldRecipe?.name == newRecipe.name)
            return true;
        //try to persist similar links from old recipe to new one
        oldRecipe?._$copySimilarLinksTo(newRecipe);
        oldRecipe?._$deleteAllLinks();
        this._selectedRecipe = newRecipe;
        this.owner?._$graphChanged();
        return true;
    }
    possibleRecipeForIo(sourceIo?: RecipeIOModel | null): string | undefined {
        if(!sourceIo)
            return undefined;
        return this.possibleRecipeForItem(sourceIo.name || '', sourceIo.isInput ? 1 : -1);
    }
    possibleRecipeForItem(name: string, direction: number): string | undefined {
        let possibleRecipesArray: string[] = [];
        if(direction <= 0) {
            const possibleRecipes = this._recipesDictionary.recipesByInputMap.get(name);
            if(possibleRecipes)
                possibleRecipesArray = possibleRecipesArray.concat(possibleRecipes);
        }
        if(direction >= 0) {
            const possibleRecipes = this._recipesDictionary.recipesByOutputMap.get(name);
            if(possibleRecipes)
                possibleRecipesArray = possibleRecipesArray.concat(possibleRecipes);
        }
        if(!possibleRecipesArray.length)
            return undefined;
        return possibleRecipesArray[0];
    }
    setCount(count: number) {
        this._count = count;
        this.owner?._$graphChanged();
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
    _$save(offsetBy?: ReadonlyPointType): SavedItem {
        let rect = this.rect;
        if(offsetBy) {
            rect = rect.offsetBy(offsetBy);
        }
        return {
            n: this._item?.name || '',
            p: [Math.round(rect.x), Math.round(rect.y)],
            r: this._selectedRecipe?.name || '',
            c: (this._count == 1) ? undefined : this._count,
            f: this.isFlipped ? 1 : undefined,
            l: this._isLocked ? 1 : undefined,
        };
    }
    _$loadItem(i: SavedItem, errorCollector: ErrorCollector) {
        //TODO - show errors and status for invalid recipe
        if(!this.selectRecipe(i.r)) {
            errorCollector.collectError(`Cannot select recipe ${i.r} for item ${this.label}`);
        }
        this._rect = this._rect.assign({
            x: i.p[0],
            y: i.p[1],
        });
        this.setCount(i.c || 1);
        this.isFlipped = i.f ? true : false;
        this._isLocked = i.l ? true : false;
    }
    _$loadLink(sourceItem: BlueprintItemModel, errorCollector: ErrorCollector) {
        const sourceIoArray = sourceItem.selectedRecipe?.items;
        if(!sourceIoArray)
            return;
        let linkLoaded = false;
        for(const sourceIo of sourceIoArray) {
            const maybeTarget = this._selectedRecipe?.findSimilarIo(sourceIo, true);
            if(maybeTarget) {
                this.owner?._$addLink(sourceIo, maybeTarget);
                linkLoaded = true;
                break;
            }
        }
        if(!linkLoaded) {
            errorCollector.collectError(`Cannot load link "${sourceItem.label}" => "${this.label}"`);
        }
    }
}
