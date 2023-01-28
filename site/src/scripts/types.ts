export type InterfaceOf<T> = Pick<T, keyof T>;

export const BlueprintItemState = {
    None: 'A',
    CannotLinkTarget: 'B',
    CanLinkTarget: 'C',
    CanLinkWithRecipeChange: 'D',
    LinkAlreadyExists: 'E',
} as const;
export type BlueprintItemStateKeys = keyof typeof BlueprintItemState;
export type BlueprintItemStateValues = typeof BlueprintItemState[BlueprintItemStateKeys];
