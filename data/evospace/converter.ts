/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';
import {applyPatch} from 'diff';
import description from './description.json';
import {logistic} from './static/custom-data';
import type {GameRecipeDictionaryExData, GameRecipeIoExData} from './types/custom-game-data';
import type {ConvertedData} from '../processing';

import type {
    Images,
    JsonData,
    JsonItem,
    JsonRecipe,
    JsonRecipeDictionary,
    JsonRecipeIO,
    JsonRecipeReference,
} from './types/evospace-data';

import type {
    GameDataSerialized,
    GameItemCostSerialized,
    GameItemSerialized,
    GameRecipeDictionarySerialized,
    GameRecipeIOSerialized,
} from '#types/game-data-serialized';
//using relative path, without #types, because it is compiled into js, and not handled by typescript only
import {GameItemType, GameRecipeIOFlags} from '../../site/data/types/constants';
import {ImageProcessor} from '../image-processor';

const _dirname = __dirname;
const __parsed = path.join(_dirname, 'parsed');
const __static = path.join(_dirname, 'static');

function itemNameMapper(name: string) {
    const staticItem = 'StaticItem';
    if(name.lastIndexOf(staticItem) == (name.length - staticItem.length))
        name = name.substring(0, name.length - staticItem.length);
    return name;
}

function imageNameMapper(name: string) {
    if(name.indexOf('T_') == 0)
        name = name.substring(2);
    return name;
}

function convertRecipes(recipeDictionaries: JsonRecipeDictionary[]) {
    interface RecipeIOOptions {
        isResource?: boolean;
    }
    const mapIO = (item: JsonRecipeIO[] | JsonRecipeIO | undefined, {isResource}: RecipeIOOptions) => {
        if(!item)
            return [];
        const itemArray = Array.isArray(item) ? item : [item];

        //merge probability, copy objects
        const mappedMergedIO = new Map<string, GameRecipeIOSerialized>();
        for(const i of itemArray) {
            const count = i.Probability ? (i.Count * i.Probability) : i.Count;
            const i0 = mappedMergedIO.get(i.Name);
            let _flags = GameRecipeIOFlags.None;
            let isNotConsumed: boolean | undefined = undefined;
            if(i.Probability === 0) {
                isNotConsumed = true;
            } else if(i.Probability) {
                _flags |= GameRecipeIOFlags.HasProbability;
            }
            const exdata: GameRecipeIoExData | undefined = (isResource || isNotConsumed) ? {
                ...(isResource ? {isResource} : {}),
                ...(isNotConsumed ? {isNotConsumed} : {}),
            } : undefined;
            if(!i0) {
                mappedMergedIO.set(i.Name, {
                    name: itemNameMapper(i.Name),
                    count: count,
                    flags: _flags ? _flags : undefined,
                    exdata,
                });
            } else {
                i0.count += count;
                if(_flags)
                    i0.flags = (i0.flags || 0) | _flags;
                if(exdata)
                    i0.exdata = {...i0.exdata, ...exdata};
            }
        }

        return [...mappedMergedIO.values()];
    };
    const mapRecipes = (dictionaryName: string, recipes: JsonRecipe[]) => {
        const mappedRecipes = recipes.map((recipe) => {
            const input = [
                ...mapIO(recipe.Input, {}),
                ...mapIO(recipe.ResourceInput, {isResource: true}),
            ];
            const output = [
                ...mapIO(recipe.Output, {}),
                ...mapIO(recipe.ResourceOutput, {isResource: true}),
            ];

            const mappedRecipe = {
                name: recipe.Name,
                input: input.length ? input : undefined,
                output: output.length ? output : undefined,
                time: recipe.Ticks,
            };
            return mappedRecipe;
        });
        return mappedRecipes;
    };

    return recipeDictionaries.map((recipeDictionary) => {
        const isPump = recipeDictionary.Name == 'PumpBaseRecipeDictionary';
        const mappedDictionary: GameRecipeDictionarySerialized = {
            name: recipeDictionary.Name,
            recipes: mapRecipes(recipeDictionary.Name, recipeDictionary.Recipes),
        };
        let exdata: GameRecipeDictionaryExData | undefined = undefined;
        if(isPump) {
            exdata = {isPump: true};
        }
        mappedDictionary.exdata = exdata;
        return mappedDictionary;
    });
}

function computeBuildingCosts(recipeDictionaries: JsonRecipeDictionary[]) {
    //we take constructor, and determine building costs from its recipe
    const buildingCosts = new Map<string, GameItemCostSerialized[]>();
    const constructor = recipeDictionaries.find((d) => d.Name == 'ConstructorBaseRecipeDictionary');
    if(!constructor) {
        return buildingCosts;
    }

    for(const recipe of constructor.Recipes) {
        const item = recipe.Output?.[0];
        if(!item || !recipe.Input?.length)
            continue;
        const itemName = itemNameMapper(item.Name);
        const itemCost: GameItemCostSerialized[] = recipe.Input.map((i) => {
            return {
                name: itemNameMapper(i.Name),
                count: i.Count,
            };
        });
        buildingCosts.set(itemName, itemCost);
    }

    //recursively decompose costs to simplest items
    const rawBuildingCosts = new Map<string, GameItemCostSerialized[]>();
    const recursiveCalculateRawCosts = (itemName: string, itemCost: GameItemCostSerialized[]) => {
        const rawCost = new Map<string, number>();
        for(const product of itemCost) {
            let rawProductCost = [product];
            const productCanBeConstructed = buildingCosts.get(product.name);
            if(productCanBeConstructed) {
                rawProductCost = recursiveCalculateRawCosts(product.name, productCanBeConstructed);
            }
            for(const cost of rawProductCost) {
                const count = rawCost.get(cost.name);
                if(!count) {
                    rawCost.set(cost.name, cost.count);
                } else {
                    rawCost.set(cost.name, count + cost.count);
                }
            }
        }

        const rawCostArray = [...rawCost.entries()].map(([name, count]) => ({
            name,
            count,
        }));
        rawBuildingCosts.set(itemName, rawCostArray);
        return rawCostArray;
    };

    for(const [itemName, itemCost] of buildingCosts) {
        recursiveCalculateRawCosts(itemName, itemCost);
    }
    return rawBuildingCosts;
}

const classTypes: {[key: string]: GameItemType} = {
    SolidStaticItem: GameItemType.Solid,
    FluidStaticItem: GameItemType.Fluid,
    AbstractStaticItem: GameItemType.Energy,
};
const itemClassTypes: {[key: string]: GameItemType} = {
    Computations: GameItemType.Special,
};

const AbstractClassItems = new Set([
    'AnySolidStaticItem',
    'AnyFluidStaticItem',
    'AnyEnergyStaticItem',
]);

function convertItems(items: JsonItem[], recipeDictionaries: JsonRecipeDictionary[]) {
    const mapRecipe = (recipe?: JsonRecipeReference) => {
        if(!recipe)
            return undefined;
        return {
            recipeDictionary: recipe.RecipeDictionary,
            tier: recipe.Tier,
        };
    };

    const buildingCosts = computeBuildingCosts(recipeDictionaries);

    const itemRecipes = new Map<string, string[]>();
    for(const item of items) {
        const recipeReference = item.Recipe;
        if(recipeReference) {
            let recipes = itemRecipes.get(recipeReference.RecipeDictionary);
            if(!recipes) {
                recipes = [];
                itemRecipes.set(recipeReference.RecipeDictionary, recipes);
            }
            recipes[recipeReference.Tier] = itemNameMapper(item.Name);
        }
    }

    return items.map((item) => {
        const mappedItem: GameItemSerialized = {
            name: itemNameMapper(item.Name),
            label: item.Label,
            image: imageNameMapper(item.Image),
            unitMul: (item.UnitMul == 1) ? undefined : item.UnitMul,
            recipe: mapRecipe(item.Recipe),
            isAbstractClassItem: AbstractClassItems.has(item.Name) || undefined,
        };
        mappedItem.type = itemClassTypes[mappedItem.name] || classTypes[item.Class];
        const cost = buildingCosts.get(mappedItem.name);
        if(cost && mappedItem.recipe) {
            //no need for cost for non-factory items
            mappedItem.cost = cost;
        }
        const tierList = item.Recipe && itemRecipes.get(item.Recipe.RecipeDictionary);
        if(tierList) {
            const thisTier = item.Recipe?.Tier || 0;
            if((thisTier > 0) && (tierList[thisTier - 1])) {
                mappedItem.prevTier = tierList[thisTier - 1];
            }
            if(tierList[thisTier + 1]) {
                mappedItem.nextTier = tierList[thisTier + 1];
            }
        }
        return mappedItem;
    });
}

function convertLogistic() {
    /**
     * after making some experiments in real game it appeared robotic arms speed is actually 2x slower than written in game hint
     * example:
     *
     * - copper arm is described as 150 degrees per second, which for 180 degrees placement means 360 degrees per item
     *   which should result 150 / 360 = 0.417 items per second
     * - actual copper arm makes 10 items for 51.5 seconds, which is 10 / 51.5 = 0.194 items per second
     *
     * - stainless steel arm is 450 degrees per second, which for 180 degrees placement results 450 / 360 = 1.25 items per second
     * - actual stainless steel arm makes 20 items for 34 seconds, which is 20 / 34 = 0.588 items per second
     *
     * The experimental number is 2.13 - 2.15 slower, lets assume it is roughly 2x to take measurement errors
     */
    logistic.forEach((l) => {
        if((l.name == 'RobotArm90') || (l.name == 'RobotArm180')) {
            l.time = l.time * 2;
        }
        l.items.forEach((item) => {
            item.name = itemNameMapper(item.name);
        });
        l.transport.forEach((transport) => {
            transport.name = itemNameMapper(transport.name);
        });
    });
    return logistic;
}

async function convertGameData() {
    const parsedData: string = fs.readFileSync(path.join(__parsed, 'data.json'), 'utf8');
    let patchData: string | null = null;
    try {
        patchData = fs.readFileSync(path.join(__static, 'data.patch'), 'utf8');
    } catch(err) {
        if((err as NodeJS.ErrnoException).code != 'ENOENT')
            throw err;
    }
    const patchedData = patchData ? applyPatch(parsedData, patchData) : parsedData;
    const patchedDataJson: JsonData = JSON.parse(patchedData);

    const gameData: GameDataSerialized = {
        recipeDictionaries: convertRecipes(patchedDataJson.Recipes),
        items: convertItems(patchedDataJson.Items, patchedDataJson.Recipes),
        logistic: convertLogistic(),
        images: {},
        description,
    };
    return gameData;
}

async function convertImages() {
    let imagesJson: Images = JSON.parse(fs.readFileSync(path.join(__parsed, 'images.json'), 'utf8'));

    const imageProcessor = new ImageProcessor(32);
    await imageProcessor.addCollectionBuffer(fs.readFileSync(path.join(__parsed, 'images.png')), imagesJson);
    await imageProcessor.addImageFolder(path.join(__static, 'images'));

    const {image: imagesData, references} = await imageProcessor.composeImage();
    imagesJson = Object.fromEntries(
        Object.entries(references).map(([key, value]) => [imageNameMapper(key), value]),
    );

    return {
        imagesJson,
        imagesData,
    };
}

async function useConverter(): Promise<ConvertedData> {
    const gameData = await convertGameData();
    const images = await convertImages();
    gameData.images = images.imagesJson;
    return {
        gameData,
        imagesData: images.imagesData,
    };
}

export default {
    useConverter,
};
