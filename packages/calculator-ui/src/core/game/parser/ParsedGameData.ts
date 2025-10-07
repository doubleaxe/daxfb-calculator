import type {
    GameDescriptionBaseJson,
    GameItemBaseJson,
    GameItemImageJson,
    GameItemLocaleJson,
    GameItemRefBaseJson,
    GameRecipeBaseJson,
    GameRecipeDictionaryBaseJson,
    GameRecipeDictionaryReferenceBaseJson,
    GameRecipeIOBaseJson,
} from '#daxfb-shared/types/gamedata/common';
import { GameRecipeIOFlags } from '#daxfb-shared/types/gamedata/common';
import { freezeMap, freezeSet } from '#utils/CollectionUtils';

export type ReadonlyInterfaceOf<T> = Readonly<Pick<T, keyof T>>;

export type CreateGameItem = (_item: GameItemBaseJson, _locale: GameItemLocale, order: number) => GameItemBaseImpl;
export abstract class GameItemBaseImpl implements GameItemBaseJson {
    cost?: GameItemRefBaseJson[];
    flags?: number;
    image?: GameItemImageJson;
    key!: string;
    name!: string;
    nextTier?: string;
    prevTier?: string;
    recipe?: GameRecipeDictionaryReferenceBaseJson;
    tier?: number;
    type?: number;

    label: string;
    lowerLabel: string;
    order: number;
    recipeDictionary?: GameRecipeDictionaryBase;

    constructor(_item: GameItemBaseJson, _locale: GameItemLocale, order: number) {
        Object.assign(this, _item);

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
export type CreateGameRecipeIO = (
    _recipe: GameRecipeBase,
    _io: GameRecipeIOBaseJson,
    _options: RecipeIOOptions
) => GameRecipeIOBaseImpl;
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
        this.flags = _io.flags ?? GameRecipeIOFlags.None;
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

export type CreateGameRecipe = (
    recipeDictionary: GameRecipeDictionaryBase,
    recipe: GameRecipeBaseJson
) => GameRecipeBaseImpl;
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
        this.input = this.#mapIO(_recipe.input, { isInput: true }, createGameRecipeIO);
        this.output = this.#mapIO(_recipe.output, { isInput: false }, createGameRecipeIO);
    }

    #mapIO(
        itemArray: GameRecipeIOBaseJson[] | undefined,
        options: RecipeIOOptions,
        createGameRecipeIO: CreateGameRecipeIO
    ) {
        if (!itemArray) return [];
        return itemArray.map((i) => createGameRecipeIO(this, i, options));
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

export type CreateGameRecipeDictionary = (
    _recipeDictionary: GameRecipeDictionaryBaseJson
) => GameRecipeDictionaryBaseImpl;
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

        this.recipes = _recipeDictionary.recipes.map((r) => createGameRecipe(this, r));
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

export type GameDataBaseJson<
    D extends GameDescriptionBaseJson = GameDescriptionBaseJson,
    I extends GameItemBaseJson = GameItemBaseJson,
    R extends GameRecipeDictionaryBaseJson = GameRecipeDictionaryBaseJson,
> = {
    description: D;
    items: I[];
    locale: GameItemLocaleJson;
    recipes: R[];
};

export type GameItemLocale = ReadonlyMap<string, string>;

export abstract class ParsedGameDataBase {
    emptyRecipeDictionary: GameRecipeDictionaryBase;
    parsedItems: ReadonlyMap<string, GameItemBase>;
    parsedRecipes: ReadonlyMap<string, GameRecipeDictionaryBase>;

    constructor(
        gameData: GameDataBaseJson,
        createGameItem: CreateGameItem,
        createGameRecipeDictionary: CreateGameRecipeDictionary
    ) {
        const parsedItems = new Map<string, GameItemBaseImpl>();
        const parsedRecipes = new Map<string, GameRecipeDictionaryBaseImpl>();

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

        this.emptyRecipeDictionary = createGameRecipeDictionary({
            key: '',
            name: '',
            recipes: [],
        });
        this.emptyRecipeDictionary.freeze();
        this.parsedItems = freezeMap(parsedItems);
        this.parsedRecipes = freezeMap(parsedRecipes);

        Object.freeze(this);
    }
}
