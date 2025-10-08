import type { GameItemLocale, ReadonlyInterfaceOf } from '#core/game/parser/ParsedGameData';
import {
    GameDataBaseImpl,
    GameItemBaseImpl,
    GameRecipeBaseImpl,
    GameRecipeDictionaryBaseImpl,
    GameRecipeIOBaseImpl,
    ParsedGameDataBaseImpl,
} from '#core/game/parser/ParsedGameData';
import type {
    GameDataCoiJson,
    GameDescriptionCoiJson,
    GameItemCoiJson,
    GameItemRefCoiJson,
    GameRecipeCoiJson,
    GameRecipeDictionaryCoiJson,
    GameRecipeDictionaryReferenceCoiJson,
    GameRecipeIOCoiJson,
} from '#daxfb-shared/types/gamedata/coi';
import { GameItemSpecialTypeCoi } from '#daxfb-shared/types/gamedata/coi';

export class GameItemCoiImpl extends GameItemBaseImpl implements GameItemCoiJson {
    declare cost?: GameItemRefCoiJson[];
    declare recipe?: GameRecipeDictionaryReferenceCoiJson;

    declare recipeDictionary?: GameRecipeDictionaryCoi;

    type2: number;

    constructor(_item: GameItemCoiJson, _locale: GameItemLocale, order: number) {
        super(_item, _locale, order);

        this.type2 = _item.type2 ?? GameItemSpecialTypeCoi.Unknown;
    }
}
export type GameItemCoi = ReadonlyInterfaceOf<GameItemCoiImpl>;

export class GameRecipeIOCoiImpl extends GameRecipeIOBaseImpl implements GameRecipeIOCoiJson {
    declare product: GameItemCoi;
    declare recipe: GameRecipeCoi;
}
export type GameRecipeIOCoi = ReadonlyInterfaceOf<GameRecipeIOCoiImpl>;

export class GameRecipeCoiImpl extends GameRecipeBaseImpl implements GameRecipeCoiJson {
    declare input: GameRecipeIOCoi[];
    declare output: GameRecipeIOCoi[];

    declare recipeDictionary: GameRecipeDictionaryCoi;

    constructor(_recipeDictionary: GameRecipeDictionaryCoi, _recipe: GameRecipeCoiJson) {
        super(
            _recipeDictionary,
            _recipe,
            (io, options) => new GameRecipeIOCoiImpl(this, io as GameRecipeIOCoiJson, options)
        );
    }
}
export type GameRecipeCoi = ReadonlyInterfaceOf<GameRecipeCoiImpl>;

export class GameRecipeDictionaryCoiImpl extends GameRecipeDictionaryBaseImpl implements GameRecipeDictionaryCoiJson {
    declare recipes: GameRecipeCoi[];
    declare items: GameItemCoi[];
    declare recipesMap: ReadonlyMap<string, GameRecipeCoi>;

    constructor(_recipeDictionary: GameRecipeDictionaryCoiJson) {
        super(_recipeDictionary, (recipe) => new GameRecipeCoiImpl(this, recipe as GameRecipeCoiJson));
    }
}
export type GameRecipeDictionaryCoi = ReadonlyInterfaceOf<GameRecipeDictionaryCoiImpl>;

export class ParsedGameDataCoiImpl extends ParsedGameDataBaseImpl<
    GameDescriptionCoiJson,
    GameRecipeDictionaryCoiJson,
    GameRecipeDictionaryCoi,
    GameItemCoiJson,
    GameItemCoi
> {
    constructor(gameData: GameDataCoiJson) {
        super(
            gameData,
            (item, locale, order) => new GameItemCoiImpl(item, locale, order),
            (recipe) =>
                new GameRecipeDictionaryCoiImpl(
                    recipe ?? {
                        key: '',
                        name: '',
                        recipes: [],
                    }
                )
        );
    }
}
export type ParsedGameDataCoi = ReadonlyInterfaceOf<ParsedGameDataCoiImpl>;

export class GameDataCoiImpl extends GameDataBaseImpl<
    GameDescriptionCoiJson,
    GameRecipeDictionaryCoiJson,
    GameRecipeDictionaryCoi,
    GameItemCoiJson,
    GameItemCoi
> {
    constructor(gameData: GameDataCoiJson) {
        super(gameData, new ParsedGameDataCoiImpl(gameData));
    }
}
export type GameDataCoi = ReadonlyInterfaceOf<GameDataCoiImpl>;
