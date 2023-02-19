/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export interface GameImages {
    [key: string]: number[];
}

export interface GameDescription {
    name: string;
    shortName: string;
    description: string;
    url?: string;
    version: string;
    saveVersion: number;
    compatibleSaveVersions: number[];
}

export interface GameRecipeIO {
    name: string;
    count: number;
    hasProbability?: boolean;
    type?: string;
}

export interface GameRecipe {
    name: string;
    //ordered in natural order
    input?: GameRecipeIO[];
    //ordered in natural order
    output?: GameRecipeIO[];
    time: number;
}

export interface GameRecipeDictionary {
    name: string;
    //ordered in natural order
    recipes: GameRecipe[];
}

export interface GameRecipeReference {
    recipeDictionary: string;
    tier?: number;
}

export interface GameItem {
    name: string;
    label: string;
    image: string;
    unitMul?: number;
    recipe?: GameRecipeReference;
}

export interface GameData {
    //ordered in natural order
    recipeDictionaries: GameRecipeDictionary[];
    //ordered in natural order
    items: GameItem[];
    images: GameImages;
    description: GameDescription;
}
