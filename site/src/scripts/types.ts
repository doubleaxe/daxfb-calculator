/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export type InterfaceOf<T> = Pick<T, keyof T>;
export type Keys<T> = keyof T;
export type Values<T> = T[keyof T];

export const BlueprintItemState = {
    None: 'A',
    CannotLinkTarget: 'B',
    CanLinkTarget: 'C',
    CanLinkWithRecipeChange: 'D',
    LinkAlreadyExists: 'E',
} as const;
export type BlueprintItemStateKeys = Keys<typeof BlueprintItemState>;
export type BlueprintItemStateValues = Values<typeof BlueprintItemState>;


export const DEFAULT_PRECISION = .001;
export const MIN_PRECISION = 1e-8;

export const DEFAULT_BLUEPRINT_SPLIT = 60;

export const Objective = {
    Primary: 7,
    Secondary: 5,
    LowPriority: 3,
} as const;
export type ObjectiveType = typeof Objective[keyof typeof Objective] | undefined;
