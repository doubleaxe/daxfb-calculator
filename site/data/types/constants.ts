/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

export enum GameItemType {
    Unknown = 0,
    Solid = 1,
    Liquid,
    Gas,
    Fluid,
    Countable,
    Loose,
    Molten,
    Energy,
    Special,
}

export const GameRecipeIOFlags = {
    None: 0,
    HasProbability: 1,
    HideInMenu: 4,
    HideOnWindow: 8,
    RoundToCeil: 16,
} as const;
