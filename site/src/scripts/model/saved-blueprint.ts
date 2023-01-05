export type SavedBlueprint = {
    i: SavedItem[];
    l: AnySavedLink[];
};

export type SavedItem = {
    n: string;
    p: number[];
    r: string;
};

export type SavedLink = {
    l: ShortSavedLink;
};

export type ShortSavedLink = number[];

export type AnySavedLink = SavedLink | ShortSavedLink;
