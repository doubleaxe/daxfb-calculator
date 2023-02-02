/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
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
    n: string;
    p: number[];
    r: string;
    c?: number;
    f?: 1;
};

export type SavedLink = {
    l: number[];
};
