export type InterfaceOf<T> = Pick<T, keyof T>;

export const BlueprintItemState = {
    None: 'A',
    CannotLinkTarget: 'B',
    CanLinkTarget: 'C',
    LinkAlreadyExists: 'D',
} as const;
export type BlueprintItemStateKeys = keyof typeof BlueprintItemState;
export type BlueprintItemStateValues = typeof BlueprintItemState[BlueprintItemStateKeys];
