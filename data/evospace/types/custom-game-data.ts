/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export const GameRecipeIOFlags2 = {
    Resource: 1,
    NotConsumed: 2,
} as const;

export type GameRecipeDictionaryExData = {
    isPump?: boolean;
    startingTier?: number;
};
