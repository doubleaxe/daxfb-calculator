import type {
    GameDescriptionJson,
    GameItemBase,
    GameItemBaseJson,
    GameItemLocaleJson,
    GameItemRefBase,
    GameItemRefBaseJson,
    GameRecipeBase,
    GameRecipeBaseJson,
    GameRecipeDictionaryBase,
    GameRecipeDictionaryBaseJson,
    GameRecipeDictionaryReferenceBaseJson,
    GameRecipeIOBase,
    GameRecipeIOBaseJson,
} from './common.js';

export { GameItemFlags, GameRecipeIOFlags } from './common.js';

/**
 * JSON serialized
 */
export const GameItemType = {
    Unknown: 0,
    Fluid: 1,
    Countable: 2,
    Loose: 3,
    Molten: 4,
    Energy: 5,
    Special: 6,
} as const;

export const GameItemSpecialType = {
    Unknown: 0,
    Electricity: 1,
    MechPower: 2,
    Computing: 3,
    Upoints: 4,
    Maintenance: 5,
    Pollution: 6,
    Worker: 7,
} as const;

export type GameItemRefCoiJson = GameItemRefBaseJson;

export type GameRecipeIOCoiJson = GameRecipeIOBaseJson;

export type GameRecipeCoiJson = GameRecipeBaseJson;

export type GameRecipeDictionaryCoiJson = GameRecipeDictionaryBaseJson;

export type GameRecipeDictionaryReferenceCoiJson = GameRecipeDictionaryReferenceBaseJson;

export type GameItemCoiJson = {
    type?: number;
    type2?: number;
} & GameItemBaseJson;

export type GameItemLocaleCoiJson = GameItemLocaleJson;

export type GameDescriptionCoiJson = GameDescriptionJson;

/**
 * loaded and parsed
 */
export type GameItemRefCoi = GameItemRefBase;

export type GameRecipeIOCoi = GameRecipeIOBase;

export type GameRecipeCoi = GameRecipeBase;

export type GameRecipeDictionaryCoi = GameRecipeDictionaryBase;

export type GameRecipeDictionaryReferenceCoi = GameRecipeDictionaryReferenceBaseJson;

export type GameItemCoi = GameItemBase & GameItemCoiJson;
