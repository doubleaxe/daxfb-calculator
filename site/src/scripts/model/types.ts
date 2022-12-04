
export interface ItemModelInterface {
    get x(): number;
    get y(): number;
}

export type ItemMutationFunction<Param> = (item: ItemModelInterface, _old: Param, _new: Param) => void;
export interface ItemMutationObserver {
    mutateX: ItemMutationFunction<number>;
    mutateY: ItemMutationFunction<number>;
}
