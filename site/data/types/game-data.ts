/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    GameItemSerialized,
    GameRecipeSerialized,
    GameRecipeDictionarySerialized,
    GameRecipeIOSerialized,
    GameRecipeReferenceSerialized,
    GameDescriptionSerialized,
    GameImagesSerialized,
} from './game-data-serialized';

export type GameImages = Readonly<GameImagesSerialized>;

//the same game data but with cross-links and other preparsing
//used for easier lookups and calculations
export interface GameRecipeIO extends Readonly<GameRecipeIOSerialized> {
    readonly isInput: boolean;
    readonly recipe: GameRecipe;
    readonly product: GameItem;

    getCountPerSecond: (item: GameItem) => number;
}

export interface GameRecipe extends Readonly<GameRecipeSerialized> {
    //ordered in natural order
    readonly input: GameRecipeIO[];
    //ordered in natural order
    readonly output: GameRecipeIO[];
    readonly recipeDictionary: GameRecipeDictionary;
}

export interface GameRecipeDictionary extends Readonly<GameRecipeDictionarySerialized> {
    //ordered in natural order
    readonly recipes: GameRecipe[];
    readonly items: GameItem[];

    readonly recipesMap: ReadonlyMap<string, GameRecipe>;
    //item name => recipe names
    readonly recipesByInputMap: ReadonlyMap<string, string[]>;
    readonly recipesByOutputMap: ReadonlyMap<string, string[]>;
}

export type GameRecipeReference = Readonly<GameRecipeReferenceSerialized>;

export interface GameItem extends Readonly<GameItemSerialized> {
    readonly lowerLabel: string;
    readonly recipeDictionary?: GameRecipeDictionary;
}

export interface GameDescription extends Readonly<GameDescriptionSerialized> {
    minTier: number;
    maxTier: number;
}
