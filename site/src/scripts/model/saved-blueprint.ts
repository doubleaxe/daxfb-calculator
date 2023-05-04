/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export type SavedBlueprint = {
    h?: Header;
    i: SavedItem[];
    l: SavedLink[];
};

export type Header = {
    g: string;
    v: number;
};

export type SavedItem = {
    //name
    n: string;
    //position [x, y]
    p: number[];
    //recipe key
    r: string;
    //count
    c?: number;
    //is flipped
    f?: 1;
    //is locked
    l?: 1;
    //custom order of inputs
    o1?: number[];
    //custom order of outputs
    o2?: number[];
};

export type SavedLink = {
    l: number[];
    n?: string;
};
