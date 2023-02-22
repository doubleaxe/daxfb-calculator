/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
//this is used for storage inside json
export interface GameImagesSerialized {
    [key: string]: number[];
}

export interface GameDescriptionSerialized {
    name: string;
    longName?: string;
    shortName: string;
    description: string;
    url?: string;
    version: string;
    saveVersion: number;
    compatibleSaveVersions: number[];
}

export interface GameRecipeIOSerialized {
    name: string;
    longName?: string;
    count: number;
    hasProbability?: boolean;
    type?: number;
}

export interface GameRecipeSerialized {
    name: string;
    longName?: string;
    //ordered in natural order
    input?: GameRecipeIOSerialized[];
    //ordered in natural order
    output?: GameRecipeIOSerialized[];
    time: number;
}

export interface GameRecipeDictionarySerialized {
    name: string;
    longName?: string;
    //ordered in natural order
    recipes: GameRecipeSerialized[];
}

export interface GameRecipeReferenceSerialized {
    recipeDictionary: string;
    longRecipeDictionary?: string;
    tier?: number;
}

export interface GameItemSerialized {
    name: string;
    longName?: string;
    label: string;
    image: string;
    unitMul?: number;
    recipe?: GameRecipeReferenceSerialized;
}

export interface GameDataSerialized {
    //ordered in natural order
    recipeDictionaries: GameRecipeDictionarySerialized[];
    //ordered in natural order
    items: GameItemSerialized[];
    images: GameImagesSerialized;
    description: GameDescriptionSerialized;
}

export type DebugKeys = {[k: string]: string};
