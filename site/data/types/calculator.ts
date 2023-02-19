/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import type {
    GameRecipeIO,
    GameRecipe,
    GameItem,
} from './game-data';

export type IOItem = {
    io: GameRecipeIO;
    item: GameItem;
};

export type ExItemData = {
    minItemTier: number;
};

export interface Calculator {
    getCountPerSecond: (item: GameItem, recipe: GameRecipe, io: IOItem, exData: ExItemData) => number;
}

export type CalculatorFactory = () => Calculator;
