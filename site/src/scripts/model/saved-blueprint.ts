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
