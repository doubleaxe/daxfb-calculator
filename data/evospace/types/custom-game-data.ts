/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export const GameRecipeIOType = {
    Resource: 1,
} as const;

export const GameItemType = {
    Solid: 1,
    Fluid: 2,
    Energy: 3,
    Special: 4,
} as const;

export type GameItemTypeValue = typeof GameItemType[keyof typeof GameItemType];
