/**
 * JSON serialized
 */
export const GameRecipeIOFlags = {
    None: 0,
    HasProbability: 1,
    Hidden: 4,
    RoundToCeil: 8,
} as const;

export type GameItemRefBaseJson = {
    count: number;
    key: string;
    name: string;
};

export type GameRecipeIOBaseJson = {
    // common flags used in global code
    // see GameRecipeIOFlags
    flags?: number;
} & GameItemRefBaseJson;

export type GameRecipeBaseJson = {
    // ordered in natural order
    input?: GameRecipeIOBaseJson[];
    key: string;
    // ordered in natural order
    output?: GameRecipeIOBaseJson[];
    time: number;
};

export type GameRecipeDictionaryBaseJson = {
    key: string;
    name: string;
    // ordered in natural order
    recipes: GameRecipeBaseJson[];
};

export type GameRecipeDictionaryReferenceBaseJson = {
    key: string;
};

export type GameItemImageJson = [number, number];

export const GameItemFlags = {
    None: 0,
    AbstractTypePlaceholderItem: 1,
} as const;

export type GameItemBaseJson = {
    cost?: GameItemRefBaseJson[];
    flags?: number;
    image?: GameItemImageJson;
    key: string;
    name: string;
    nextTier?: string;
    prevTier?: string;
    recipe?: GameRecipeDictionaryReferenceBaseJson;
    tier?: number;
    type?: number;
};

export type GameItemLocaleJson = [string, string][];

export type GameDescriptionJson = {
    compatibleSaveVersions: number[];
    description: string;
    name: string;
    saveVersion: number;
    shortName: string;
    url?: string;
    version: string;
};

/**
 * loaded and parsed
 */
export type GameItemRefBase = GameItemRefBaseJson;

export type GameRecipeIOBase = {
    isInput: boolean;
    product: GameItemBase;
    recipe: GameRecipeBase;
} & GameRecipeIOBaseJson;

export type GameRecipeBase = {
    // ordered in natural order
    input: GameRecipeIOBase[];
    // ordered in natural order
    output: GameRecipeIOBase[];
    recipeDictionary: GameRecipeDictionaryBase;
} & GameRecipeBaseJson;

export type GameRecipeDictionaryBase = {
    hasInputTypes: ReadonlySet<number>;
    hasOutputTypes: ReadonlySet<number>;

    items: GameItemBase[];
    // ordered in natural order
    recipes: GameRecipeBase[];
    // item name => recipe names
    recipesByInputMap: ReadonlyMap<string, string[]>;
    recipesByOutputMap: ReadonlyMap<string, string[]>;
    recipesMap: ReadonlyMap<string, GameRecipeBase>;
} & GameRecipeDictionaryBaseJson;

export type GameItemBase = {
    label: string;
    lowerLabel: string;
    order: number;
    recipeDictionary?: GameRecipeDictionaryBase;
} & GameItemBaseJson;

export type GameItemLocale = ReadonlyMap<string, string>;
