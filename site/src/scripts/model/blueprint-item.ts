/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
*/
import {dataProvider} from '../data/data';
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import type {
    BlueprintItemModel,
    BlueprintModel,
    PublicPoint,
    RecipeIOModel,
    RecipeModel,
} from './store';
import {BlueprintItemState, type BlueprintItemStateValues} from '../types';
import type {SavedItem} from './saved-blueprint';
import {Point} from '../geometry';

export class BlueprintItemModelImpl extends ItemModelImpl {
    private _position: PublicPoint = Point.assign();
    private readonly _recipesDictionary;
    private readonly _recipes;
    private _selectedRecipe?: RecipeModel;
    private _count = 1;
    private _solvedCount: number | undefined = undefined;
    private _state: BlueprintItemStateValues = BlueprintItemState.None;
    public partOfCycle = false;
    public isFlipped = false;
    public isLocked = false;

    constructor(owner: BlueprintModel, name: string) {
        super(owner, dataProvider.getItem(name));
        this._recipesDictionary = dataProvider.getRecipesForItem(this._item);
        this._recipes = this._recipesDictionary.recipesMap;
        if(this._recipes.size) {
            this._selectedRecipe = new RecipeModelImpl(this, this._recipes.values().next().value);
        }
    }

    get position(): PublicPoint { return this._position; }
    set position(position: PublicPoint) {
        this._position = position;
        this.owner?._$updateXY(this);
    }
    get selectedRecipe() { return this._selectedRecipe; }
    get recipes() { return this._recipes.values(); }
    get recipesCount() { return this._recipes.size; }
    get state() { return this._state; }
    get tier() { return this._item?.tier; }
    get count() { return this._count; }
    get solvedCount() { return this._solvedCount; }

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
            return;
        const oldRecipe = this._selectedRecipe;
        const newRecipe = new RecipeModelImpl(this, recipe);
        if(oldRecipe?.name == newRecipe.name)
            return;
        //try to persist similar links from old recipe to new one
        oldRecipe?._$copySimilarLinksTo(newRecipe);
        oldRecipe?._$deleteAllLinks();
        this._selectedRecipe = newRecipe;
        this.owner?._$graphChanged();
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
    _$save(): SavedItem {
        return {
            n: this._item?.name || '',
            p: [Math.round(this._position.x), Math.round(this._position.y)],
            r: this._selectedRecipe?.name || '',
            c: (this._count == 1) ? undefined : this._count,
            f: this.isFlipped ? 1 : undefined,
        };
    }
    _$loadItem(i: SavedItem) {
        //TODO - show errors and status for invalid recipe
        this.selectRecipe(i.r);
        this._position = this._position.assign({
            x: i.p[0],
            y: i.p[1],
        });
        this.setCount(i.c || 1);
        this.isFlipped = i.f ? true : false;
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
