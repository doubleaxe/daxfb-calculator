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

export type GameRecipeIOBaseJson<REF extends GameItemRefBaseJson = GameItemRefBaseJson> = {
    // common flags used in global code
    // see GameRecipeIOFlags
    flags?: number;
} & REF;

export type GameRecipeBaseJson<IO extends GameRecipeIOBaseJson = GameRecipeIOBaseJson> = {
    // ordered in natural order
    input?: IO[];
    key: string;
    // ordered in natural order
    output?: IO[];
    time: number;
};

export type GameRecipeDictionaryBaseJson<REC extends GameRecipeBaseJson = GameRecipeBaseJson> = {
    key: string;
    name: string;
    // ordered in natural order
    recipes: REC[];
};

export type GameRecipeDictionaryReferenceBaseJson = {
    key: string;
};

export const GameItemFlags = {
    None: 0,
    AbstractTypePlaceholderItem: 1,
} as const;

export type GameItemBaseJson<
    ITM extends GameItemRefBaseJson = GameItemRefBaseJson,
    DIC extends GameRecipeDictionaryReferenceBaseJson = GameRecipeDictionaryReferenceBaseJson,
> = {
    cost?: ITM[];
    flags?: number;
    image?: GameItemImageJson;
    key: string;
    name: string;
    nextTier?: string;
    prevTier?: string;
    recipe?: DIC;
    tier?: number;
    type?: number;
};

export type GameDescriptionBaseJson = {
    compatibleSaveVersions: number[];
    description: string;
    name: string;
    saveVersion: number;
    shortName: string;
    url?: string;
    version: string;
};

export type GameItemImageJson = [number, number];

export type GameItemLocaleJson = [string, string][];
