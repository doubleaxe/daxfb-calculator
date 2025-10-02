import type {
    GameDataBaseJson,
    GameItemBase,
    GameItemLocale,
    GameItemRefBase,
    GameRecipeBase,
    GameRecipeDictionaryBase,
    GameRecipeDictionaryReferenceBase,
    GameRecipeIOBase,
} from '#core/game/parser/ParserTypes';
import type {
    GameDescriptionCoiJson,
    GameItemCoiJson,
    GameItemRefCoiJson,
    GameRecipeCoiJson,
    GameRecipeDictionaryCoiJson,
    GameRecipeDictionaryReferenceCoiJson,
    GameRecipeIOCoiJson,
} from '#daxfb-shared/types/gamedata/coi';

export type { GameItemLocale };

/**
 * loaded and parsed
 */

export type GameDataCoiJson = {
    description: GameDescriptionCoiJson;
    items: GameItemCoiJson[];
    recipes: GameRecipeDictionaryCoiJson[];
} & GameDataBaseJson;

export type GameItemRefCoi = GameItemRefBase & GameItemRefCoiJson;

export type GameRecipeIOCoi = {
    product: GameItemCoi;
    recipe: GameRecipeCoi;
} & GameRecipeIOBase &
    GameRecipeIOCoiJson;

export type GameRecipeCoi = { recipeDictionary: GameRecipeDictionaryCoi } & GameRecipeBase<GameRecipeIOCoi> &
    GameRecipeCoiJson;

export type GameRecipeDictionaryCoi = GameRecipeDictionaryBase<GameRecipeIOCoi, GameRecipeCoi> &
    GameRecipeDictionaryCoiJson;

export type GameRecipeDictionaryReferenceCoi = GameRecipeDictionaryReferenceBase & GameRecipeDictionaryReferenceCoiJson;

export type GameItemCoi = GameItemBase<
    GameItemRefCoi,
    GameRecipeDictionaryReferenceCoi,
    GameRecipeIOCoi,
    GameRecipeCoi
> &
    GameItemCoiJson;
