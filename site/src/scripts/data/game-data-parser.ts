/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameImplementation} from '#types/game-implementation';
import type {
    GameDescription,
    GameDescriptionRaw,
    GameImages,
    GameItem,
    GameItemRaw,
    GameRecipe,
    GameRecipeDictionary,
    GameRecipeDictionaryRaw,
    GameRecipeIO,
    GameRecipeIORaw,
    GameRecipeRaw,
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
    emptyRecipeDictionary: GameRecipeDictionary;
    images: GameImages;
    description: GameDescription;
};

//package private item
type ItemImpl = {
    item: GameItem;
    _postInit: (parsedRecipes: ParsedRecipesImpl) => void;
};
function createItemImpl(_item: GameItemSerialized) {
    const item: GameItemRaw = {
        ..._item,
        lowerLabel: _item.label.toLowerCase(),
        recipeDictionary: undefined,
    };

    const itemImpl: ItemImpl = {
        item,
        _postInit(parsedRecipesImpl: ParsedRecipesImpl) {
            if(item.recipe) {
                const recipeDictionaryImpl = parsedRecipesImpl.get(item.recipe.recipeDictionary);
                recipeDictionaryImpl?._postInitItem(this);
                item.recipeDictionary = recipeDictionaryImpl?.recipeDictionary;
            }
            if(item.recipe)
                Object.freeze(item.recipe);
            Object.freeze(item);
        },
    };

    return itemImpl;
}

//package private io
interface RecipeIOOptions {
    isInput: boolean;
}
type RecipeIOImpl = {
    io: GameRecipeIO;
    _postInit: (parsedItems: ParsedItemsImpl) => void;
};
function createRecipeIOImpl(recipeImpl: Readonly<RecipeImpl>, _io: GameRecipeIOSerialized, options: RecipeIOOptions) {
    let _cachedCount: number | undefined;
    const calculator = recipeImpl.recipeDictionaryImpl.calculator;
    const io: GameRecipeIORaw = {
        ..._io,
        isInput: options.isInput,
        isCommon: false,
        recipe: recipeImpl.recipe,
        product: {} as GameItem,
        //count per second is immutable
        getCountPerSecond(item: GameItem) {
            if(!_cachedCount) {
                _cachedCount = calculator.getCountPerSecond(item, this);
            }
            return _cachedCount || 0;
        },
    };
    io.isCommon = calculator.isCommonIo(io);

    const ioImpl: RecipeIOImpl = {
        io,
        _postInit(parsedItemsImpl: ParsedItemsImpl) {
            const itemImpl = parsedItemsImpl.get(io.name);
            if(itemImpl) {
                io.product = itemImpl.item;
            }
            Object.freeze(io);
        },
    };

    return ioImpl;
}

//package private recipe
type RecipeImpl = {
    recipe: GameRecipe;
    recipeDictionaryImpl: Readonly<RecipeDictionaryImpl>;
    _postInit: (parsedItems: ParsedItemsImpl) => void;
};
function createRecipeImpl(recipeDictionaryImpl: Readonly<RecipeDictionaryImpl>, _recipe: GameRecipeSerialized) {
    function mapIO(_recipeImpl: RecipeImpl, itemArray: GameRecipeIOSerialized[] | undefined, options: RecipeIOOptions) {
        if(!itemArray)
            return [];
        return itemArray.map((i) => createRecipeIOImpl(_recipeImpl, i, options));
    }

    let ioImpl: RecipeIOImpl[] = [];
    const recipe: GameRecipeRaw = {
        ..._recipe,
        recipeDictionary: recipeDictionaryImpl.recipeDictionary,
        input: [],
        output: [],
    };

    const recipeImpl: RecipeImpl = {
        recipe,
        recipeDictionaryImpl,
        _postInit(parsedItemsImpl: ParsedItemsImpl) {
            for(const io of ioImpl) {
                io._postInit(parsedItemsImpl);
            }
            Object.freeze(recipe.input);
            Object.freeze(recipe.output);
            Object.freeze(recipe);
        },
    };

    const inputImpl = mapIO(recipeImpl, _recipe.input, {isInput: true});
    const outputImpl = mapIO(recipeImpl, _recipe.output, {isInput: false});
    recipe.input = inputImpl.map(({io}) => io);
    recipe.output = outputImpl.map(({io}) => io);
    ioImpl = [...inputImpl, ...outputImpl];

    return recipeImpl;
}

//package private recipe dictionary
type RecipeDictionaryImpl = {
    recipeDictionary: GameRecipeDictionary;
    calculator: Calculator;
    _postInitItem: (item: Readonly<ItemImpl>) => void;
    _postInit: (parsedItems: ParsedItemsImpl) => void;
};
function createRecipeDictionaryImpl(calculator: Calculator, _recipeDictionary: GameRecipeDictionarySerialized) {
    const emptyMap = new Map();
    let recipesImpl: RecipeImpl[] = [];
    const recipeDictionary: GameRecipeDictionaryRaw = {
        ..._recipeDictionary,
        recipes: [],
        items: [],

        recipesMap: emptyMap,
        //item name => recipe names
        recipesByInputMap: emptyMap,
        recipesByOutputMap: emptyMap,
    };

    const recipeDictionaryImpl: RecipeDictionaryImpl = {
        recipeDictionary,
        calculator,
        _postInitItem(itemImpl: Readonly<ItemImpl>) {
            recipeDictionary.items.push(itemImpl.item);
        },
        _postInit(parsedItemsImpl: ParsedItemsImpl) {
            for(const recipeImpl of recipesImpl) {
                recipeImpl._postInit(parsedItemsImpl);
            }

            Object.freeze(recipeDictionary.recipes);
            Object.freeze(recipeDictionary.items);

            recipeDictionary.recipesMap = freezeMap(new Map<string, GameRecipe>(
                recipeDictionary.recipes.map((r) => [r.name, r]),
            ));

            const recipesByProduct = (type: 'input' | 'output') => {
                const recipesByProductMap = new Map<string, string[]>();
                for(const recipe of recipeDictionary.recipes) {
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
            recipeDictionary.recipesByInputMap = recipesByProduct('input');
            recipeDictionary.recipesByOutputMap = recipesByProduct('output');
            Object.freeze(recipeDictionary);
        },
    };

    recipesImpl = recipeDictionary.recipes.map((r) => createRecipeImpl(recipeDictionaryImpl, r));
    recipeDictionary.recipes = recipesImpl.map(({recipe}) => recipe);

    return recipeDictionaryImpl;
}

type DescriptionData = {
    minTier: number;
    maxTier: number;
};
function createDescriptionImpl(_description: GameDescriptionSerialized, data: DescriptionData) {
    const description: GameDescriptionRaw = {
        ..._description,
        ...data,
    };

    //sanitize header
    description.shortName = (description.shortName + 'XX').substring(0, 2);
    Object.freeze(description.compatibleSaveVersions);
    Object.freeze(description);

    return description;
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

    const parsedItemsImpl = new Map<string, ItemImpl>();
    const parsedRecipesImpl = new Map<string, RecipeDictionaryImpl>();
    const parsedItems = new Map<string, GameItem>();
    const parsedRecipes = new Map<string, GameRecipeDictionary>();

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
        const itemImpl = createItemImpl(value);
        parsedItemsImpl.set(value.name, itemImpl);
        parsedItems.set(value.name, itemImpl.item);
    }
    for(const value of gameData.recipeDictionaries) {
        const recipeDictionaryImpl = createRecipeDictionaryImpl(calculator, value);
        parsedRecipesImpl.set(value.name, recipeDictionaryImpl);
        parsedRecipes.set(value.name, recipeDictionaryImpl.recipeDictionary);
    }
    for(const itemImpl of parsedItemsImpl.values()) {
        itemImpl._postInit(parsedRecipesImpl);
    }
    for(const recipeDictionaryImpl of parsedRecipesImpl.values()) {
        recipeDictionaryImpl._postInit(parsedItemsImpl);
    }

    const description = createDescriptionImpl(gameData.description, {minTier, maxTier});
    const images = gameData.images;
    Object.freeze(images);

    const {recipeDictionary: emptyRecipeDictionary} = createRecipeDictionaryImpl(calculator, {
        name: '',
        recipes: [],
    });
    Object.freeze(emptyRecipeDictionary);

    return {
        parsedItems: freezeMap(parsedItems),
        parsedRecipes: freezeMap(parsedRecipes),
        emptyRecipeDictionary,
        images,
        description,
    };
}
