import { action, makeObservable, observable } from 'mobx';

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

    protected __position: XYPosition = { x: 0, y: 0 };
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

        makeObservable<FactoryModelBaseImpl, '__selectedRecipe'>(this, {
            status: observable,
            isFlipped: observable,
            __selectedRecipe: observable,
            deleteThis: action,
        });
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

    deleteThis() {
        this.__flowChart?.__deleteItem(this);
    }

    __getRecipe(key: string) {
        return this.__recipesDictionary.recipesMap.get(key);
    }
    __getIO(itemId: string) {
        return this.__selectedRecipe?.__getIO(itemId);
    }
    __findConnectable(target: RecipeIOModelBase) {
        return this.__selectedRecipe?.__findConnectable(target);
    }
    __findAlreadyLinked(target: RecipeIOModelBase) {
        return this.__selectedRecipe?.__findAlreadyLinked(target);
    }
}
