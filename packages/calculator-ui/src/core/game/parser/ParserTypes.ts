import type {
    GameDescriptionBaseJson,
    GameItemBaseJson,
    GameItemLocaleJson,
    GameItemRefBaseJson,
    GameRecipeBaseJson,
    GameRecipeDictionaryBaseJson,
    GameRecipeDictionaryReferenceBaseJson,
    GameRecipeIOBaseJson,
} from '#daxfb-shared/types/gamedata/common';

/**
 * loaded and parsed
 */

export type GameDataBaseJson = {
    description: GameDescriptionBaseJson;
    items: GameItemBaseJson[];
    locale: GameItemLocaleJson;
    recipes: GameRecipeDictionaryBaseJson[];
};

// cannot use all templates here, due to circular dependencies
export type GameItemRefBase = GameItemRefBaseJson;

export type GameRecipeIOBase = {
    isInput: boolean;
    product: GameItemBase;
    recipe: GameRecipeBase;
} & GameRecipeIOBaseJson;

export type GameRecipeBase<IO extends GameRecipeIOBase = GameRecipeIOBase> = {
    recipeDictionary: GameRecipeDictionaryBase;
} & GameRecipeBaseJson<IO>;

export type GameRecipeDictionaryBase<
    IO extends GameRecipeIOBase = GameRecipeIOBase,
    REC extends GameRecipeBase<IO> = GameRecipeBase<IO>,
> = {
    hasInputTypes: ReadonlySet<number>;
    hasOutputTypes: ReadonlySet<number>;

    items: GameItemBase[];
    // item name => recipe names
    recipesByInputMap: ReadonlyMap<string, string[]>;
    recipesByOutputMap: ReadonlyMap<string, string[]>;
    recipesMap: ReadonlyMap<string, GameRecipeBase>;
} & GameRecipeDictionaryBaseJson<REC>;

export type GameRecipeDictionaryReferenceBase = GameRecipeDictionaryReferenceBaseJson;

export type GameItemBase<
    TIM extends GameItemRefBase = GameItemRefBase,
    DIC extends GameRecipeDictionaryReferenceBase = GameRecipeDictionaryReferenceBase,
    IO extends GameRecipeIOBase = GameRecipeIOBase,
    REC extends GameRecipeBase<IO> = GameRecipeBase<IO>,
> = {
    label: string;
    lowerLabel: string;
    order: number;
    recipeDictionary?: GameRecipeDictionaryBase<IO, REC>;
} & GameItemBaseJson<TIM, DIC>;

export type GameItemLocale = ReadonlyMap<string, string>;
