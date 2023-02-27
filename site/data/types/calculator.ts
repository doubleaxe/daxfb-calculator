/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import type {
    FromatCountPerSecond,
    GameItem,
    GameRecipeIO,
} from './game-data';

export interface Calculator {
    getCountPerSecond: (item: GameItem, io: GameRecipeIO) => number;
    formatCountPerSecond: (io: GameRecipeIO, count: number) => FromatCountPerSecond;
    isCommonIo: (io: GameRecipeIO) => boolean;
}
