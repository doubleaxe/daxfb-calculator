export type SavedBlueprint = {
    i: SavedItem[];
    l: SavedLink[];
};

export type SavedItem = {
    n: string;
    p: number[];
    r: string;
};

export type SavedLink = {
    l: number[];
};
