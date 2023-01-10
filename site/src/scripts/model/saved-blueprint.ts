export type SavedBlueprint = {
    i: SavedItem[];
    l: SavedLink[];
};

export type SavedItem = {
    n: string;
    p: number[];
    r: string;
    c?: number;
};

export type SavedLink = {
    l: number[];
};
