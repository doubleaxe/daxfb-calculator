/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItemType} from './constants';
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
    GameItemCostSerialized,
} from './game-data-serialized';

export type GameImagesRaw = GameImagesSerialized;
export type GameImages = Readonly<GameImagesRaw>;

//the same game data but with cross-links and other preparsing
//used for easier lookups and calculations
export interface GameRecipeIORaw extends GameRecipeIOSerialized {
    isInput: boolean;
    //common flags used in global code
    //see GameRecipeIOFlags
    flags: number;
    recipe: GameRecipe;
    product: GameItem;

    getCountPerSecond: (item: GameItem) => number;
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

export type GameItemCostRaw = GameItemCostSerialized;
export type GameItemCost = Readonly<GameItemCostRaw>;

export interface GameItemRaw extends GameItemSerialized {
    lowerLabel: string;
    recipeDictionary?: GameRecipeDictionary;
    cost?: GameItemCost[];
    order: number;

    formatCountPerSecond: (count: number) => FormatCountPerSecond;
}
export type GameItem = Readonly<GameItemRaw>;

export type GameLogisticItemRaw = GameLogisticItemSerialized;
export type GameLogisticItem = Readonly<GameLogisticItemRaw>;

export interface GameLogisticTransportRaw extends GameLogisticTransportSerialized {
    logistic: GameLogistic;
    item: GameItem;
    countPerSecond: number;
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

export type FormatCountPerSecond = {
    count: number;
    unit: string;
};

export type ParsedItems = ReadonlyMap<string, GameItem>;
export type ParsedRecipes = ReadonlyMap<string, GameRecipeDictionary>;
