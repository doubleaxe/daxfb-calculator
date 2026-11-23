import type { ErrorCollector } from '#core/utils/ErrorCollector.js';

import type { FlowChartAction } from '../actions/index.js';
import { NodeStatus } from './constants.js';
import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import type { XYPosition } from './internal/internal.js';
import type { SerializedFactory, SerializedLink } from './internal/ModelSerialized.js';
import { ItemModelBaseImpl } from './ItemModel.js';
import type { FactorySnapshotBase, RecipeSnapshotBase } from './ModelSnapshot.js';
import type { CreateRecipeModel, RecipeModelBaseImpl } from './RecipeModel.js';
import type { RecipeIOModelBase, RecipeModelBase } from './types.js';

export type CreateFactoryModel<
    CHART extends FlowChartModelBaseImpl = FlowChartModelBaseImpl,
    SNAP extends FactorySnapshotBase = FactorySnapshotBase,
    FACT extends FactoryModelBaseImpl = FactoryModelBaseImpl,
> = (__flowChart: CHART, key: string, snapshot: SNAP | undefined) => FACT;

export abstract class FactoryModelBaseImpl extends ItemModelBaseImpl {
    public status: NodeStatus = NodeStatus.None;
    public partOfCycle = false;
    public chainContainsError = false;

    protected __position: XYPosition = { x: 0, y: 0 };
    protected __isFlipped = false;
    protected __count = 1;
    protected __solvedCount: number | undefined = undefined;
    protected __weight: number | undefined = undefined;
    protected __locked = false;
    protected readonly __recipesDictionary;
    protected __selectedRecipe: RecipeModelBaseImpl | undefined;

    protected readonly __recipeModelConstructor: CreateRecipeModel;

    constructor(
        __flowChart: FlowChartModelBaseImpl,
        key: string,
        snapshot: FactorySnapshotBase | undefined,
        __recipeModelConstructor: CreateRecipeModel
    ) {
        super(__flowChart, __flowChart.gameData.getGameItem(key), snapshot?.snapshot.itemId);
        this.__recipeModelConstructor = __recipeModelConstructor;
        this.__recipesDictionary = __flowChart.gameData.getItemRecipeDictionary(this.__item);

        const recipes = this.__recipesDictionary.recipes;
        if (!snapshot?.snapshot.recipe && recipes.length && recipes[0]) {
            // snapshot will select recipe later
            this.__selectedRecipe = __recipeModelConstructor(this, recipes[0].key, undefined);
        }
    }

    isUpgradable(direction?: -1 | 1): boolean {
        if (!this.__item?.prevTier && !this.__item?.nextTier) return false;
        if (direction === undefined) return true;
        if (direction < 0 && this.__item?.prevTier) return true;
        if (direction > 0 && this.__item?.nextTier) return true;
        return false;
    }
    upgrade(direction: -1 | 1) {
        //tricky. will recreate new item, and place it instead of old one
        const nextTier = direction > 0 ? this.__item?.nextTier : this.__item?.prevTier;
        if (!nextTier) return;
        const key = this.__flowChart.gameData.getGameItemByName(nextTier)?.key;
        if (!key) return;

        const newItem = this.__flowChart.__addItem(key);
        newItem.__isFlipped = this.__isFlipped;
        newItem.__position = this.__position;
        newItem.__count = this.__count;
        newItem.__weight = this.__weight;
        newItem.__locked = this.__locked;
        if (this.__selectedRecipe) {
            newItem.__selectSimilarRecipe(this.__selectedRecipe);
        }

        this.deleteItem();
    }

    get position() {
        return this.__position;
    }
    get isFlipped() {
        return this.__isFlipped;
    }
    get selectedRecipe(): RecipeModelBase | undefined {
        return this.__selectedRecipe;
    }
    get recipes() {
        return this.__recipesDictionary.recipes;
    }
    get count() {
        return this.__count;
    }
    get solvedCount() {
        return this.__solvedCount;
    }
    get weight() {
        return this.__weight;
    }
    get locked() {
        return this.__locked;
    }

    setCount(count: number): FlowChartAction {
        const countOld = this.__count;
        return {
            after: () => this.__flowChart.__requestSolveGraph([this]),
            undo: () => {
                this.__count = countOld;
            },
            redo: () => {
                this.__count = count;
            },
        };
    }
    setSolvedCount(solvedCount: number | undefined) {
        this.__solvedCount = solvedCount;
    }
    setWeight(weight: number | undefined): FlowChartAction {
        const weightOld = this.__weight;
        return {
            after: () => this.__flowChart.__requestSolveGraph([this]),
            undo: () => {
                this.__weight = weightOld;
            },
            redo: () => {
                this.__weight = weight;
            },
        };
    }
    setLocked(locked: boolean): FlowChartAction {
        const lockedOld = this.__locked;
        return {
            after: () => this.__flowChart.__requestSolveGraph([this]),
            undo: () => {
                this.__locked = lockedOld;
            },
            redo: () => {
                this.__locked = locked;
            },
        };
    }
    setFlipped(isFlipped: boolean): FlowChartAction {
        const isFlippedOld = this.__isFlipped;
        return {
            undo: () => {
                this.__isFlipped = isFlippedOld;
            },
            redo: () => {
                this.__isFlipped = isFlipped;
            },
        };
    }
    resetSolutionStatus() {
        this.chainContainsError = false;
        for (const io of this.__selectedRecipe?.ports ?? []) {
            io.setCausesSolvingError(false);
            for (const link of io.links) {
                link.setFlow(undefined);
            }
        }
    }
    __possibleRecipesForIo(sourceIo?: RecipeIOModelBase): string[] {
        if (!sourceIo) return [];
        return this.__possibleRecipesForItem(sourceIo.key, sourceIo.isInput ? 1 : -1);
    }
    __possibleRecipesForItem(itemId: string | undefined, direction: number): string[] {
        let possibleRecipesArray: string[] = [];
        if (!itemId) return possibleRecipesArray;
        if (direction <= 0) {
            const possibleRecipes = this.__recipesDictionary.recipesByInputMap.get(itemId);
            if (possibleRecipes) possibleRecipesArray = possibleRecipesArray.concat(possibleRecipes);
        }
        if (direction >= 0) {
            const possibleRecipes = this.__recipesDictionary.recipesByOutputMap.get(itemId);
            if (possibleRecipes) possibleRecipesArray = possibleRecipesArray.concat(possibleRecipes);
        }
        return possibleRecipesArray;
    }
    __selectSimilarRecipe(otherRecipe: RecipeModelBaseImpl) {
        //try to select similar recipe
        //next tier may not have same recipe, we must just check all io, and select most appropriate
        const recipeWeight = new Map<string, number>();
        const calcWeight = (
            ioArray: IterableIterator<RecipeIOModelBase> | undefined,
            recipeMap: ReadonlyMap<string, string[]>
        ) => {
            if (!ioArray) {
                return;
            }
            for (const io of ioArray) {
                const recipe = recipeMap.get(io.key ?? '') ?? [];
                for (const recipeItem of recipe) {
                    const weight = recipeWeight.get(recipeItem) ?? 0;
                    recipeWeight.set(recipeItem, weight + 1);
                }
            }
        };
        calcWeight(otherRecipe.input, this.__recipesDictionary.recipesByInputMap);
        calcWeight(otherRecipe.output, this.__recipesDictionary.recipesByOutputMap);
        const selectedRecipe = [...recipeWeight.entries()].sort((a, b) => b[1] - a[1])?.[0]?.[0];

        if (selectedRecipe) {
            this.selectRecipe(selectedRecipe);
            if (this.__selectedRecipe) {
                otherRecipe.__copySimilarLinksTo(this.__selectedRecipe);
            }
        }
    }

    setPosition(position: XYPosition) {
        this.__position = position;
    }

    deleteAllLinks() {
        return this.__selectedRecipe?.__deleteAllLinks();
    }
    deleteItem() {
        //if it is not linked to anything, it will not change graph
        //if it linked - __deleteLink will cause graph update
        this.__selectedRecipe?.__deleteAllLinks();
        this.__flowChart?.__deleteItem(this);
    }

    selectRecipe(key: string) {
        return this.__selectRecipe(key);
    }
    __selectRecipe(key: string, snapshot?: RecipeSnapshotBase) {
        const oldRecipe = this.__selectedRecipe;
        if (!snapshot && key === oldRecipe?.key) return false;
        const newRecipe = this.__recipeModelConstructor(this, key, snapshot);
        if (!snapshot) {
            //try to persist similar links from old recipe to new one
            oldRecipe?.__copySimilarLinksTo(newRecipe);
        }
        oldRecipe?.__deleteAllLinks();
        this.__selectedRecipe = newRecipe;
        return true;
    }

    __getRecipe(key: string) {
        return this.__recipesDictionary.recipesMap.get(key);
    }
    __getIOById(itemId: string) {
        return this.__selectedRecipe?.__getIOById(itemId);
    }
    __getIOByKey(key: string) {
        return this.__selectedRecipe?.__getIOByKey(key);
    }
    __findConnectable(target: RecipeIOModelBase) {
        return this.__selectedRecipe?.__findConnectable(target);
    }
    __findAlreadyLinked(target: RecipeIOModelBase) {
        return this.__selectedRecipe?.__findAlreadyLinked(target);
    }

    __loadItem(i: SerializedFactory, errorCollector: ErrorCollector) {
        if (!this.selectRecipe(i.r)) {
            errorCollector.collectError(`Cannot select recipe ${i.r} for item ${this.label}`);
        }
        this.__position = {
            x: i.p[0] ?? 0,
            y: i.p[1] ?? 0,
        };
        this.__count = i.c ?? 1;
        this.__isFlipped = !!i.f;
        this.__weight = i.w;
        this.__selectedRecipe?.__loadIoOrder(i);
    }
    __loadLink(l: SerializedLink, outputItem: FactoryModelBaseImpl, errorCollector: ErrorCollector) {
        if (this.__selectedRecipe && outputItem.__selectedRecipe) {
            return this.__selectedRecipe.__loadLink(l, outputItem.__selectedRecipe, errorCollector);
        }
        return undefined;
    }

    __saveToSnapshot() {
        const snapshot = this.__flowChart.__snapshotFactory.newFactorySnapshot({
            count: this.__count,
            isFlipped: this.__isFlipped,
            itemId: this.itemId,
            key: this.key ?? '',
            locked: this.__locked,
            position: { x: this.__position.x, y: this.__position.y },
            recipe: this.__selectedRecipe?.__saveToSnapshot(),
            weight: this.__weight,
        });
        return snapshot;
    }
}
