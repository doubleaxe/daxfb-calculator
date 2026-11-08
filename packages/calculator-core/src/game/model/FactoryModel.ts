import { NodeStatus } from './constants.js';
import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import { ItemModelBaseImpl } from './ItemModel.js';
import type { CreateRecipeModel, RecipeModelBaseImpl } from './RecipeModel.js';
import type { RecipeIOModelBase, RecipeModelBase } from './types.js';

type XYPosition = {
    x: number;
    y: number;
};

export type CreateFactoryModel<
    CHART extends FlowChartModelBaseImpl = FlowChartModelBaseImpl,
    FACT extends FactoryModelBaseImpl = FactoryModelBaseImpl,
> = (__flowChart: CHART, key: string) => FACT;

export abstract class FactoryModelBaseImpl extends ItemModelBaseImpl {
    public status: NodeStatus = NodeStatus.None;
    public isFlipped = false;
    public partOfCycle = false;
    public chainContainsError = false;

    protected __position: XYPosition = { x: 0, y: 0 };
    protected __count = 1;
    protected __solvedCount: number | undefined = undefined;
    protected __weight: number | undefined = undefined;
    protected __locked = false;
    protected readonly __recipesDictionary;
    protected __selectedRecipe?: RecipeModelBaseImpl;

    protected readonly __recipeModelConstructor: CreateRecipeModel;

    constructor(__flowChart: FlowChartModelBaseImpl, key: string, __recipeModelConstructor: CreateRecipeModel) {
        super(__flowChart, __flowChart.gameData.getGameItem(key));
        this.__recipeModelConstructor = __recipeModelConstructor;
        this.__recipesDictionary = __flowChart.gameData.getItemRecipeDictionary(this.__item);

        const recipes = this.__recipesDictionary.recipes;
        if (recipes.length && recipes[0]) {
            this.__selectedRecipe = __recipeModelConstructor(this, recipes[0].key);
        }
    }

    get upgradable() {
        return !!this.__item?.prevTier || !!this.__item?.nextTier;
    }

    get position() {
        return this.__position;
    }
    get selectedRecipe(): RecipeModelBase | undefined {
        return this.__selectedRecipe;
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

    setCount(count: number) {
        this.__count = count;
        this.__flowChart.__requestSolveGraph([this]);
    }
    setSolvedCount(solvedCount: number | undefined) {
        this.__solvedCount = solvedCount;
    }
    setWeight(weight: number | undefined) {
        this.__weight = weight;
        this.__flowChart.__requestSolveGraph([this]);
    }
    setLocked(locked: boolean) {
        this.__locked = locked;
        this.__flowChart.__requestSolveGraph([this]);
    }
    flip() {
        this.isFlipped = !this.isFlipped;
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

    setPosition(position: XYPosition) {
        this.__position = position;
    }

    deleteAllLinks() {
        this.__selectedRecipe?.__deleteAllLinks();
    }
    deleteItem() {
        //if it is not linked to anything, it will not change graph
        //if it linked - __deleteLink will cause graph update
        this.__selectedRecipe?.__deleteAllLinks();
        this.__flowChart?.__deleteItem(this);
    }

    selectRecipe(key: string) {
        const oldRecipe = this.__selectedRecipe;
        if (key === oldRecipe?.key) return false;
        const newRecipe = this.__recipeModelConstructor(this, key);
        //try to persist similar links from old recipe to new one
        oldRecipe?.__copySimilarLinksTo(newRecipe);
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
}
