/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItemType} from './contants';
import type {
    GameItemSerialized,
    GameRecipeSerialized,
    GameRecipeDictionarySerialized,
    GameRecipeIOSerialized,
    GameRecipeReferenceSerialized,
    GameDescriptionSerialized,
    GameImagesSerialized,
    GameLogisticItemSerialized,
    GameLogisticTransportSerialized,
    GameLogisticSerialized,
} from './game-data-serialized';

export type GameImagesRaw = GameImagesSerialized;
export type GameImages = Readonly<GameImagesRaw>;

//the same game data but with cross-links and other preparsing
//used for easier lookups and calculations
export interface GameRecipeIORaw extends GameRecipeIOSerialized {
    isInput: boolean;
    isCommon: boolean;
    recipe: GameRecipe;
    product: GameItem;

    getCountPerSecond: (item: GameItem) => number;
    formatCountPerSecond: (count: number) => FromatCountPerSecond;
}
export type GameRecipeIO = Readonly<GameRecipeIORaw>;

export interface GameRecipeRaw extends GameRecipeSerialized {
    //ordered in natural order
    input: GameRecipeIO[];
    //ordered in natural order
    output: GameRecipeIO[];
    recipeDictionary: GameRecipeDictionary;
}
export type GameRecipe = Readonly<GameRecipeRaw>;

export interface GameRecipeDictionaryRaw extends GameRecipeDictionarySerialized {
    //ordered in natural order
    recipes: GameRecipe[];
    items: GameItem[];

    recipesMap: ReadonlyMap<string, GameRecipe>;
    //item name => recipe names
    recipesByInputMap: ReadonlyMap<string, string[]>;
    recipesByOutputMap: ReadonlyMap<string, string[]>;
    hasInputTypes: ReadonlySet<GameItemType>;
    hasOutputTypes: ReadonlySet<GameItemType>;
}
export type GameRecipeDictionary = Readonly<GameRecipeDictionaryRaw>;

export type GameRecipeReferenceRaw = GameRecipeReferenceSerialized;
export type GameRecipeReference = Readonly<GameRecipeReferenceRaw>;

export interface GameItemRaw extends GameItemSerialized {
    lowerLabel: string;
    recipeDictionary?: GameRecipeDictionary;
}
export type GameItem = Readonly<GameItemRaw>;

export type GameLogisticItemRaw = GameLogisticItemSerialized;
export type GameLogisticItem = Readonly<GameLogisticItemRaw>;

export interface GameLogisticTransportRaw extends GameLogisticTransportSerialized {
    logistic: GameLogistic;
    item: GameItem;
    countPerSecond: number;
    formatCountPerSecond: (count: number) => FromatCountPerSecond;
}
export type GameLogisticTransport = Readonly<GameLogisticTransportRaw>;

export interface GameLogisticRaw extends GameLogisticSerialized {
    //ordered from slowest to fastest
    transport: GameLogisticTransport[];
}
export type GameLogistic = Readonly<GameLogisticRaw>;

export interface GameDescriptionRaw extends GameDescriptionSerialized {
    minTier: number;
    maxTier: number;
}
export type GameDescription = Readonly<GameDescriptionRaw>;

export type FromatCountPerSecond = {
    count: number;
    unit: string;
};
