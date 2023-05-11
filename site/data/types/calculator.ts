/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import type {
    FormatCountPerSecond,
    GameItem,
    GameRecipeIO,
} from './game-data';

export interface Calculator {
    getCountPerSecond: (item: GameItem, io: GameRecipeIO) => number;
    formatCountPerSecond: (item: GameItem, count: number) => FormatCountPerSecond;
    calculateIoFlags?: (io: GameRecipeIO) => number;
}
