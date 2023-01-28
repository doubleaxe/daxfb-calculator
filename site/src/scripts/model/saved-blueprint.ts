/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
*/
export type SavedBlueprint = {
    i: SavedItem[];
    l: SavedLink[];
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
