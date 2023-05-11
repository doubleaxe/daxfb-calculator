/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItemType} from './constants';

//this is used for storage inside json
export interface GameImagesSerialized {
    [key: string]: number[];
}

export interface GameExDataSerialized {
    [key: string]: unknown;
}

export interface GameDescriptionSerialized {
    name: string;
    shortName: string;
    description: string;
    url?: string;
    version: string;
    saveVersion: number;
    compatibleSaveVersions: number[];
    groupTier?: boolean;
}

export interface GameRecipeIOSerialized {
    name: string;
    longName?: string;
    count: number;
    //common flags used in global code
    //see GameRecipeIOFlags
    flags?: number;
    exdata?: GameExDataSerialized;
}

export interface GameRecipeSerialized {
    name: string;
    longName?: string;
    //ordered in natural order
    input?: GameRecipeIOSerialized[];
    //ordered in natural order
    output?: GameRecipeIOSerialized[];
    time: number;
    exdata?: GameExDataSerialized;
}

export interface GameRecipeDictionarySerialized {
    name: string;
    longName?: string;
    //ordered in natural order
    recipes: GameRecipeSerialized[];
    exdata?: GameExDataSerialized;
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
    type?: GameItemType;
    isAbstractClassItem?: boolean;
    nextTier?: string;
    prevTier?: string;
    exdata?: GameExDataSerialized;
}

export interface GameLogisticItemSerialized {
    name: string;
    longName?: string;
}

export interface GameLogisticTransportSerialized {
    name: string;
    longName?: string;
    label?: string;
    count: number;
    exdata?: GameExDataSerialized;
}

export interface GameLogisticSerialized {
    name: string;
    longName?: string;
    label?: string;
    items: GameLogisticItemSerialized[];
    transport: GameLogisticTransportSerialized[];
    time: number;
    stackable?: boolean;
    exdata?: GameExDataSerialized;
}

export interface GameDataSerialized {
    //ordered in natural order
    recipeDictionaries: GameRecipeDictionarySerialized[];
    //ordered in natural order
    items: GameItemSerialized[];
    //ordered in natural order
    logistic?: GameLogisticSerialized[];
    images: GameImagesSerialized;
    description: GameDescriptionSerialized;
}

export type DebugKeys = {[k: string]: string};
