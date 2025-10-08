import type {
    GameDataBaseJson,
    GameDescriptionBaseJson,
    GameItemBaseJson,
    GameItemImageJson,
    GameItemRefBaseJson,
    GameRecipeBaseJson,
    GameRecipeDictionaryBaseJson,
    GameRecipeDictionaryReferenceBaseJson,
    GameRecipeIOBaseJson,
} from '#daxfb-shared/types/gamedata/common';
import { GameItemFlagsBase, GameItemTypeBase, GameRecipeIOFlagsBase } from '#daxfb-shared/types/gamedata/common';
import { freezeMap, freezeSet } from '#utils/CollectionUtils';

export type ReadonlyInterfaceOf<T> = Readonly<Pick<T, keyof T>>;

export type CreateGameItem<ITMJ extends GameItemBaseJson, ITM extends GameItemBase> = (
    _item: ITMJ,
    _locale: GameItemLocale,
    order: number
) => ITM;
export abstract class GameItemBaseImpl implements GameItemBaseJson {
    cost?: GameItemRefBaseJson[];
    flags: number;
    image?: GameItemImageJson;
    key!: string;
    name!: string;
    nextTier?: string;
    prevTier?: string;
    recipe?: GameRecipeDictionaryReferenceBaseJson;
    tier?: number;
    type: number;

    label: string;
    lowerLabel: string;
    order: number;
    recipeDictionary?: GameRecipeDictionaryBase;

    constructor(_item: GameItemBaseJson, _locale: GameItemLocale, order: number) {
        Object.assign(this, _item);

        this.flags = _item.flags ?? GameItemFlagsBase.None;
        this.type = _item.type ?? GameItemTypeBase.Unknown;

        const label = _locale.get(_item.key) ?? _item.name;
        this.label = label;
        this.lowerLabel = label.toLowerCase();
        this.order = order;
    }

    postInit(_recipeDictionary: GameRecipeDictionaryBase) {
        this.recipeDictionary = _recipeDictionary;
    }
    freeze() {
        if (this.image) Object.freeze(this.image);
        if (this.recipe) Object.freeze(this.recipe);
        if (this.cost) {
            this.cost.forEach((cost) => Object.freeze(cost));
            Object.freeze(this.cost);
        }
        Object.freeze(this);
    }
}
export type GameItemBase = ReadonlyInterfaceOf<GameItemBaseImpl>;

export type RecipeIOOptions = {
    isInput: boolean;
};
export type CreateGameRecipeIO = (io: GameRecipeIOBaseJson, options: RecipeIOOptions) => GameRecipeIOBase;
export abstract class GameRecipeIOBaseImpl implements GameRecipeIOBaseJson {
    count!: number;
    key!: string;
    name!: string;
    flags: number;

    isInput: boolean;
    product!: GameItemBase;
    recipe: GameRecipeBase;

    constructor(_recipe: GameRecipeBase, _io: GameRecipeIOBaseJson, options: RecipeIOOptions) {
        Object.assign(this, _io);

        this.isInput = options.isInput;
        this.flags = _io.flags ?? GameRecipeIOFlagsBase.None;
        this.recipe = _recipe;
    }

    postInit(_product: GameItemBase) {
        this.product = _product;
    }
    freeze() {
        Object.freeze(this);
    }
}
export type GameRecipeIOBase = ReadonlyInterfaceOf<GameRecipeIOBaseImpl>;

export type CreateGameRecipe = (recipe: GameRecipeBaseJson) => GameRecipeBase;
export abstract class GameRecipeBaseImpl implements GameRecipeBaseJson {
    input: GameRecipeIOBase[];
    key!: string;
    output: GameRecipeIOBase[];
    time!: number;

    recipeDictionary: GameRecipeDictionaryBase;

    constructor(
        _recipeDictionary: GameRecipeDictionaryBase,
        _recipe: GameRecipeBaseJson,
        createGameRecipeIO: CreateGameRecipeIO
    ) {
        Object.assign(this, _recipe);

        this.recipeDictionary = _recipeDictionary;
        this.input = GameRecipeBaseImpl.#mapIO(_recipe.input, { isInput: true }, createGameRecipeIO);
        this.output = GameRecipeBaseImpl.#mapIO(_recipe.output, { isInput: false }, createGameRecipeIO);
    }

    static #mapIO(
        itemArray: GameRecipeIOBaseJson[] | undefined,
        options: RecipeIOOptions,
        createGameRecipeIO: CreateGameRecipeIO
    ) {
        if (!itemArray) return [];
        return itemArray.map((i) => createGameRecipeIO(i, options));
    }

    freeze() {
        this.input.forEach((io) => io.freeze());
        Object.freeze(this.input);
        this.output.forEach((io) => io.freeze());
        Object.freeze(this.output);
        Object.freeze(this);
    }
}
export type GameRecipeBase = ReadonlyInterfaceOf<GameRecipeBaseImpl>;

export type CreateGameRecipeDictionary<
    RECJ extends GameRecipeDictionaryBaseJson,
    REC extends GameRecipeDictionaryBase,
> = (_recipeDictionary: null | RECJ) => REC;
export abstract class GameRecipeDictionaryBaseImpl implements GameRecipeDictionaryBaseJson {
    key!: string;
    name!: string;
    recipes: GameRecipeBase[];

    hasInputTypes: ReadonlySet<number>;
    hasOutputTypes: ReadonlySet<number>;

    items: GameItemBase[];
    // item name => recipe names
    recipesByInputMap: ReadonlyMap<string, string[]>;
    recipesByOutputMap: ReadonlyMap<string, string[]>;
    recipesMap: ReadonlyMap<string, GameRecipeBase>;

    constructor(_recipeDictionary: GameRecipeDictionaryBaseJson, createGameRecipe: CreateGameRecipe) {
        Object.assign(this, _recipeDictionary);

        this.recipes = _recipeDictionary.recipes.map((r) => createGameRecipe(r));
        this.items = [];
        this.recipesMap = freezeMap(new Map<string, GameRecipeBase>(this.recipes.map((r) => [r.key, r])));

        const { recipesByProductMap: recipesByInputMap, hasIoTypes: hasInputTypes } = this.#recipesByProduct('input');
        this.recipesByInputMap = recipesByInputMap;
        this.hasInputTypes = hasInputTypes;

        const { recipesByProductMap: recipesByOutputMap, hasIoTypes: hasOutputTypes } =
            this.#recipesByProduct('output');
        this.recipesByOutputMap = recipesByOutputMap;
        this.hasOutputTypes = hasOutputTypes;
    }

    #recipesByProduct(type: 'input' | 'output') {
        const recipesByProductMap = new Map<string, string[]>();
        const hasIoTypes = new Set<number>();
        for (const recipe of this.recipes) {
            for (const io of recipe[type]) {
                let byProduct = recipesByProductMap.get(io.key);
                if (!byProduct) {
                    byProduct = [];
                    recipesByProductMap.set(io.key, byProduct);
                }
                byProduct.push(recipe.key);
                if (io.product.type) {
                    hasIoTypes.add(io.product.type);
                }
            }
        }
        return {
            recipesByProductMap: freezeMap(recipesByProductMap),
            hasIoTypes: freezeSet(hasIoTypes),
        };
    }

    postInit(_item: GameItemBase) {
        this.items.push(_item);
    }
    freeze() {
        this.recipes.forEach((r) => r.freeze());
        Object.freeze(this.recipes);
        Object.freeze(this.items);
        Object.freeze(this);
    }
}
export type GameRecipeDictionaryBase = ReadonlyInterfaceOf<GameRecipeDictionaryBaseImpl>;

export type GameItemLocale = ReadonlyMap<string, string>;

export abstract class ParsedGameDataBaseImpl<
    DESCJ extends GameDescriptionBaseJson,
    RECJ extends GameRecipeDictionaryBaseJson,
    REC extends GameRecipeDictionaryBase,
    ITMJ extends GameItemBaseJson,
    ITM extends GameItemBase,
> {
    emptyRecipeDictionary: REC;
    parsedItems: ReadonlyMap<string, ITM>;
    parsedRecipes: ReadonlyMap<string, REC>;

    constructor(
        gameData: GameDataBaseJson<DESCJ, ITMJ, RECJ>,
        createGameItem: CreateGameItem<ITMJ, ITM>,
        createGameRecipeDictionary: CreateGameRecipeDictionary<RECJ, REC>
    ) {
        const parsedItems = new Map<string, ITM>();
        const parsedRecipes = new Map<string, REC>();

        const locale: GameItemLocale = new Map<string, string>(gameData.locale.map(([key, value]) => [key, value]));
        gameData.items.forEach((value, index) => {
            const item = createGameItem(value, locale, index);
            parsedItems.set(value.key, item);
        });
        gameData.recipes.forEach((value) => {
            const recipeDictionary = createGameRecipeDictionary(value);
            parsedRecipes.set(value.key, recipeDictionary);
        });

        // now let's cross link
        for (const item of parsedItems.values()) {
            if (item.recipe) {
                const recipeDictionary = parsedRecipes.get(item.recipe.key);
                if (recipeDictionary) {
                    recipeDictionary.postInit(item);
                    item.postInit(recipeDictionary);
                }
            }
            item.freeze();
        }

        for (const recipeDictionary of parsedRecipes.values()) {
            for (const recipe of recipeDictionary.recipes) {
                for (const io of [...recipe.input, ...recipe.output]) {
                    const item = parsedItems.get(io.key);
                    if (item) {
                        io.postInit(item);
                    }
                }
            }
            recipeDictionary.freeze();
        }

        this.emptyRecipeDictionary = createGameRecipeDictionary(null);
        this.emptyRecipeDictionary.freeze();
        this.parsedItems = freezeMap(parsedItems);
        this.parsedRecipes = freezeMap(parsedRecipes);

        Object.freeze(this);
    }
}
export type ParsedGameDataBase<
    DESCJ extends GameDescriptionBaseJson = GameDescriptionBaseJson,
    RECJ extends GameRecipeDictionaryBaseJson = GameRecipeDictionaryBaseJson,
    REC extends GameRecipeDictionaryBase = GameRecipeDictionaryBase,
    ITMJ extends GameItemBaseJson = GameItemBaseJson,
    ITM extends GameItemBase = GameItemBase,
> = ReadonlyInterfaceOf<ParsedGameDataBaseImpl<DESCJ, RECJ, REC, ITMJ, ITM>>;

export abstract class GameDataBaseImpl<
    DESCJ extends GameDescriptionBaseJson,
    RECJ extends GameRecipeDictionaryBaseJson,
    REC extends GameRecipeDictionaryBase,
    ITMJ extends GameItemBaseJson,
    ITM extends GameItemBase,
> {
    gameItemsArray;
    gameAbstractItems;
    gameItemsByType;
    #gameItemsMap;
    gameFactoriesArray;
    description;
    #emptyRecipeDictionary;
    constructor(
        gameData: GameDataBaseJson<DESCJ, ITMJ, RECJ>,
        parsedGameData: ParsedGameDataBase<DESCJ, RECJ, REC, ITMJ, ITM>
    ) {
        const gameItemsMap = parsedGameData.parsedItems;
        const gameItemsArray = [...gameItemsMap.values()];

        const gameAbstractItems = gameItemsArray.reduce((map, item) => {
            if (item.flags & GameItemFlagsBase.AbstractTypePlaceholderItem && item.type) {
                if (map.has(item.type)) {
                    throw new Error(`Duplicate abstract item type ${item.type}`);
                } else {
                    map.set(item.type, item);
                }
            }
            return map;
        }, new Map<number, GameItemBase>());

        const gameItemsByType = gameItemsArray.reduce((map, item) => {
            const type = item.type;
            const items = map.get(type);
            if (!items) {
                map.set(type, [item]);
            } else {
                items.push(item);
            }
            return map;
        }, new Map<number, GameItemBase[]>());

        const gameFactoriesArray = gameItemsArray.filter((item) => item.recipeDictionary);
        const emptyRecipeDictionary = parsedGameData.emptyRecipeDictionary;

        this.gameItemsArray = Object.freeze(gameItemsArray);
        this.gameAbstractItems = freezeMap(gameAbstractItems);
        this.gameItemsByType = freezeMap(gameItemsByType);
        this.#gameItemsMap = gameItemsMap;
        this.gameFactoriesArray = Object.freeze(gameFactoriesArray);
        this.description = Object.freeze(gameData.description);
        Object.freeze(gameData.description.compatibleSaveVersions);
        this.#emptyRecipeDictionary = emptyRecipeDictionary;
        Object.freeze(this);
    }

    getGameItem(key: string) {
        return this.#gameItemsMap.get(key);
    }
    getItemRecipeDictionary(item?: GameItemBase) {
        return item?.recipeDictionary ?? this.#emptyRecipeDictionary;
    }
}
export type GameDataBase<
    DESCJ extends GameDescriptionBaseJson = GameDescriptionBaseJson,
    RECJ extends GameRecipeDictionaryBaseJson = GameRecipeDictionaryBaseJson,
    REC extends GameRecipeDictionaryBase = GameRecipeDictionaryBase,
    ITMJ extends GameItemBaseJson = GameItemBaseJson,
    ITM extends GameItemBase = GameItemBase,
> = ReadonlyInterfaceOf<GameDataBaseImpl<DESCJ, RECJ, REC, ITMJ, ITM>>;
