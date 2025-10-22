import { action, makeObservable, observable } from 'mobx';

import type { FlowChartModelBaseImpl } from './FlowChartModel';
import { ItemModelBaseImpl } from './ItemModel';
import type { CreateRecipeModel, RecipeModelBaseImpl } from './RecipeModel';
import type { RecipeModelBase } from './types';

type XYPosition = {
    x: number;
    y: number;
};

export type CreateFactoryModel<
    CHART extends FlowChartModelBaseImpl = FlowChartModelBaseImpl,
    FACT extends FactoryModelBaseImpl = FactoryModelBaseImpl,
> = (__flowChart: CHART, key: string) => FACT;

export abstract class FactoryModelBaseImpl extends ItemModelBaseImpl {
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
            isFlipped: observable,
            __selectedRecipe: observable,
            deleteThis: action,
        });
    }

    get position() {
        return this.__position;
    }
    get selectedRecipe(): RecipeModelBase | undefined {
        return this.__selectedRecipe;
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
}
