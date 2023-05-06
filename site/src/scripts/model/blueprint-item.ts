/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {RecipeModelImpl} from './recipe';
import {ItemModelImpl} from './item';
import type {
    BlueprintItemModel,
    BlueprintModel,
    LinkModel,
    RecipeIOModel,
    RecipeModel,
} from './store';
import {BlueprintItemState, DEFAULT_PRIORITY, type BlueprintItemStateValues, type PriorityType} from '../types';
import type {SavedItem, SavedLink} from './saved-blueprint';
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
    private _priority: PriorityType = DEFAULT_PRIORITY;
    private _initializationCompleted = false;
    private _linksGenerationNumber = 0;

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
    setLocked(isLocked: boolean) { this._isLocked = isLocked; this.owner?._$graphChanged(false, this); }
    get priority() { return this._priority; }
    setPriority(priority: PriorityType) { this._priority = priority; this.owner?._$graphChanged(false, this); }
    initializationCompleted() {
        if(!this._initializationCompleted) {
            this._initializationCompleted = true;
            this.owner?._$itemInitializationCompleted(this);
        }
    }
    get linksGenerationNumber() { return this._linksGenerationNumber; }

    calculateLinkState(sourceIo?: RecipeIOModel | null): BlueprintItemStateValues {
        if(!sourceIo) {
            return BlueprintItemState.None;
        }
        const maybeTarget = this._selectedRecipe?._$findSimilarIo(sourceIo, true);
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
        const maybeTarget = this._selectedRecipe?._$findSimilarIo(sourceIo, true);
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
        this.owner?._$graphChanged(false, this);
        return true;
    }
    possibleRecipeForIo(sourceIo?: RecipeIOModel | null): string | undefined {
        if(!sourceIo || (sourceIo.isAbstractClassItem && !sourceIo.isMatherialized))
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
        this.owner?._$graphChanged(false, this);
    }
    setSolvedCount(solvedCount?: number) {
        this._solvedCount = solvedCount;
    }
    resetFlow() {
        //input will reset automatically, because each link has two connected io
        for(const io of this._selectedRecipe?.output || []) {
            for(const link of io.links) {
                link.setFlow(undefined);
            }
        }
    }
    deleteAllLinks() {
        this._selectedRecipe?._$deleteAllLinks();
    }
    deleteThis() {
        //if it is not linked to anything, it will not change graph
        //if it linked - _$deleteLink will cause graph update
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
            ...this._selectedRecipe?._$saveIoOrder(),
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
        this._selectedRecipe?._$loadIoOrder(i);
    }
    _$loadLink(l: SavedLink, outputItem: BlueprintItemModel, errorCollector: ErrorCollector) {
        let inputIoArray = [...this.selectedRecipe?.input || []];
        let outputIoArray = [...outputItem.selectedRecipe?.output || []];
        if(!inputIoArray.length || !outputIoArray.length)
            return undefined;
        //if we can link by multiple paths for same item - then link is ambiguous
        //we should restore saved name
        if(l.n) {
            inputIoArray = inputIoArray.filter((io) => ((io.name == l.n) || io.isAbstractClassItem));
            outputIoArray = outputIoArray.filter((io) => ((io.name == l.n) || io.isAbstractClassItem));
        }
        let link: LinkModel | undefined;
        for(const inputIo of inputIoArray) {
            const maybeTarget = outputIoArray.find((io) => RecipeModelImpl._$isSimilarIo(inputIo, io));
            if(maybeTarget) {
                link = this.owner?._$addLink(inputIo, maybeTarget);
                break;
            }
        }
        if(!link) {
            errorCollector.collectError(`Cannot load link "${outputItem.label}" => "${this.label}"`);
        }
        return link;
    }

    _$linkAdded(value: LinkModel) {
        if(this._initializationCompleted) {
            this._linksGenerationNumber++;
        }
    }
    _$linkDeleted(value: LinkModel) {
        if(this._initializationCompleted) {
            this._linksGenerationNumber++;
        }
    }
    _$ioSwapped() {
        if(this._initializationCompleted) {
            this._linksGenerationNumber++;
        }
    }
}
