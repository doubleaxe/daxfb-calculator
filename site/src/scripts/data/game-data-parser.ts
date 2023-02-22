/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameImplementation} from '#types/game-implementation';
import type {
    GameDescription,
    GameImages,
    GameItem,
    GameRecipe,
    GameRecipeDictionary,
    GameRecipeIO,
    GameRecipeReference,
} from '#types/game-data';
import type {
    GameDataSerialized,
    GameDescriptionSerialized,
    GameItemSerialized,
    GameRecipeDictionarySerialized,
    GameRecipeIOSerialized,
    GameRecipeSerialized,
} from '#types/game-data-serialized';
import {inflate} from 'pako';
import {toUint8Array} from 'js-base64';
import {freezeMap} from '../util';
import type {Calculator} from '#types/calculator';

export type ParsedItems = ReadonlyMap<string, GameItem>;
export type ParsedRecipes = ReadonlyMap<string, GameRecipeDictionary>;
type ParsedItemsImpl = Map<string, Readonly<ItemImpl>>;
type ParsedRecipesImpl = Map<string, Readonly<RecipeDictionaryImpl>>;

export type ParsedGameData = {
    parsedItems: ParsedItems;
    parsedRecipes: ParsedRecipes;
    images: GameImages;
    description: GameDescription;
};

class ItemImpl implements GameItem {
    name!: string;
    longName?: string;
    label!: string;
    image!: string;
    unitMul?: number;
    recipe?: GameRecipeReference;

    lowerLabel: string;
    recipeDictionary?: Readonly<RecipeDictionaryImpl>;

    constructor(item: GameItemSerialized) {
        Object.assign(this, item);
        this.lowerLabel = item.label.toLowerCase();
    }
    _postInit(parsedRecipes: ParsedRecipesImpl) {
        if(this.recipe) {
            const recipeDictionary = parsedRecipes.get(this.recipe.recipeDictionary);
            recipeDictionary?._postInitItem(this);
            this.recipeDictionary = recipeDictionary;
        }
        if(this.recipe)
            Object.freeze(this.recipe);
        Object.freeze(this);
    }
}

interface RecipeIOOptions {
    isInput: boolean;
}

class RecipeIOImpl implements GameRecipeIO {
    name!: string;
    longName?: string;
    count!: number;
    hasProbability?: boolean;
    type?: number;

    isInput: boolean;
    recipe: Readonly<RecipeImpl>;
    product!: Readonly<ItemImpl>;

    constructor(recipe: Readonly<RecipeImpl>, io: GameRecipeIOSerialized, options: RecipeIOOptions) {
        Object.assign(this, io);

        this.isInput = options.isInput;
        this.recipe = recipe;
    }
    _postInit(parsedItems: ParsedItemsImpl) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.product = parsedItems.get(this.name)!;
        Object.freeze(this);
    }

    //count per second is immutable
    private _cachedCount?: number;
    getCountPerSecond(item: GameItem) {
        if(!this._cachedCount) {
            this._cachedCount = this.recipe.recipeDictionary.calculator.getCountPerSecond(item, this);
        }
        return this._cachedCount;
    }
}

class RecipeImpl implements GameRecipe {
    name!: string;
    longName?: string;
    //ordered in natural order
    input: Readonly<RecipeIOImpl>[];
    //ordered in natural order
    output: Readonly<RecipeIOImpl>[];
    time!: number;

    recipeDictionary: Readonly<RecipeDictionaryImpl>;

    constructor(recipeDictionary: Readonly<RecipeDictionaryImpl>, recipe: GameRecipeSerialized) {
        Object.assign(this, recipe);

        this.recipeDictionary = recipeDictionary;

        const mapIO = (itemArray: GameRecipeIOSerialized[] | undefined, options: RecipeIOOptions) => {
            if(!itemArray)
                return [];
            return itemArray.map((i) => new RecipeIOImpl(this, i, options));
        };
        this.input = mapIO(recipe.input, {isInput: true});
        this.output = mapIO(recipe.output, {isInput: false});
    }

    _postInit(parsedItems: ParsedItemsImpl) {
        for(const io of [...this.input, ...this.output]) {
            io._postInit(parsedItems);
        }
        Object.freeze(this.input);
        Object.freeze(this.output);
        Object.freeze(this);
    }
}

class RecipeDictionaryImpl implements GameRecipeDictionary {
    name!: string;
    longName?: string;

    recipes: Readonly<RecipeImpl>[];
    items: Readonly<ItemImpl>[];

    recipesMap!: ReadonlyMap<string, Readonly<RecipeImpl>>;
    //item name => recipe names
    recipesByInputMap!: ReadonlyMap<string, string[]>;
    recipesByOutputMap!: ReadonlyMap<string, string[]>;

    calculator;

    constructor(calculator: Calculator, recipeDictionary: GameRecipeDictionarySerialized) {
        Object.assign(this, recipeDictionary);

        this.recipes = recipeDictionary.recipes.map((r) => new RecipeImpl(this, r));
        this.items = [];
        this.calculator = calculator;
    }
    _postInitItem(item: Readonly<ItemImpl>) {
        this.items.push(item);
    }
    _postInit(parsedItems: ParsedItemsImpl) {
        for(const recipe of this.recipes) {
            recipe._postInit(parsedItems);
        }

        Object.freeze(this.recipes);
        Object.freeze(this.items);

        this.recipesMap = freezeMap(new Map<string, Readonly<RecipeImpl>>(
            this.recipes.map((r) => [r.name, r]),
        ));

        const recipesByProduct = (type: 'input' | 'output') => {
            const recipesByProductMap = new Map<string, string[]>();
            for(const recipe of this.recipes) {
                for(const io of recipe[type]) {
                    let byProduct = recipesByProductMap.get(io.name);
                    if(!byProduct) {
                        byProduct = [];
                        recipesByProductMap.set(io.name, byProduct);
                    }
                    byProduct.push(recipe.name);
                }
            }
            return freezeMap(recipesByProductMap);
        };
        this.recipesByInputMap = recipesByProduct('input');
        this.recipesByOutputMap = recipesByProduct('output');
        Object.freeze(this);
    }
}

type DescriptionData = {
    minTier: number;
    maxTier: number;
};

class DescriptionImpl implements GameDescription {
    name!: string;
    longName?: string;
    shortName!: string;
    description!: string;
    url?: string;
    version!: string;
    saveVersion!: number;
    compatibleSaveVersions!: number[];

    minTier: number;
    maxTier: number;

    constructor(description: GameDescriptionSerialized, data: DescriptionData) {
        Object.assign(this, description);
        //sanitize header
        this.shortName = (this.shortName + 'XX').substring(0, 2);

        this.minTier = data.minTier;
        this.maxTier = data.maxTier;

        Object.freeze(this.compatibleSaveVersions);
        Object.freeze(this);
    }
}

export function useGameDataParser(gameImplementation: GameImplementation): ParsedGameData {
    const calculator = gameImplementation.useCalculator();
    const _gameData = gameImplementation.useGameData();
    let gameData: GameDataSerialized;
    if(typeof(_gameData) == 'string') {
        const compressed = toUint8Array(_gameData);
        gameData = JSON.parse(inflate(compressed, {to: 'string'}));
    } else {
        gameData = _gameData;
    }

    const parsedItems = new Map<string, ItemImpl>();
    const parsedRecipes = new Map<string, RecipeDictionaryImpl>();

    //calculate in advance, below classes will need it
    //we'll ignore negative tiers
    let minTier: undefined | number = undefined;
    let maxTier: undefined | number = undefined;
    for(const item of gameData.items) {
        const tier1 = item.recipe?.tier;
        if((tier1 !== undefined) && (tier1 >= 0)) {
            if((minTier === undefined) || (tier1 < minTier))
                minTier = tier1;
            if((maxTier === undefined) || (tier1 > maxTier))
                maxTier = tier1;
        }
    }
    minTier = minTier ?? 0;
    maxTier = maxTier ?? 0;

    for(const value of gameData.items) {
        parsedItems.set(value.name, new ItemImpl(value));
    }
    for(const value of gameData.recipeDictionaries) {
        parsedRecipes.set(value.name, new RecipeDictionaryImpl(calculator, value));
    }
    for(const item of parsedItems.values()) {
        item._postInit(parsedRecipes);
    }
    for(const recipeDictionary of parsedRecipes.values()) {
        recipeDictionary._postInit(parsedItems);
    }

    const description = new DescriptionImpl(gameData.description, {minTier, maxTier});
    const images = gameData.images;
    Object.freeze(images);

    return {
        parsedItems: freezeMap(parsedItems),
        parsedRecipes: freezeMap(parsedRecipes),
        images,
        description,
    };
}
