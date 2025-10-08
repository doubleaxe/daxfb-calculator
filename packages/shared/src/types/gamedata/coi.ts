import type {
    GameDataBaseJson,
    GameDescriptionBaseJson,
    GameItemBaseJson,
    GameItemImageJson,
    GameItemLocaleJson,
    GameItemRefBaseJson,
    GameRecipeBaseJson,
    GameRecipeDictionaryBaseJson,
    GameRecipeDictionaryReferenceBaseJson,
    GameRecipeIOBaseJson,
} from './common.js';
import { GameItemFlagsBase, GameItemTypeBase, GameRecipeIOFlagsBase } from './common.js';

export type { GameItemImageJson, GameItemLocaleJson };

/**
 * JSON serialized
 */
export const GameItemFlagsCoi = {
    ...GameItemFlagsBase,
} as const;

export const GameRecipeIOFlagsCoi = {
    ...GameRecipeIOFlagsBase,
};

export const GameItemTypeCoi = {
    ...GameItemTypeBase,
    Fluid: 1,
    Countable: 2,
    Loose: 3,
    Molten: 4,
    Energy: 5,
    Special: 6,
} as const;

export const GameItemSpecialTypeCoi = {
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

export type GameRecipeIOCoiJson = GameRecipeIOBaseJson<GameItemRefCoiJson>;

export type GameRecipeCoiJson = GameRecipeBaseJson<GameRecipeIOCoiJson>;

export type GameRecipeDictionaryCoiJson = GameRecipeDictionaryBaseJson<GameRecipeCoiJson>;

export type GameRecipeDictionaryReferenceCoiJson = GameRecipeDictionaryReferenceBaseJson;

export type GameItemCoiJson = {
    type2?: number;
} & GameItemBaseJson<GameItemRefCoiJson, GameRecipeDictionaryReferenceCoiJson>;

export type GameDescriptionCoiJson = GameDescriptionBaseJson;

export type GameDataCoiJson = GameDataBaseJson<GameDescriptionCoiJson, GameItemCoiJson, GameRecipeDictionaryCoiJson>;
