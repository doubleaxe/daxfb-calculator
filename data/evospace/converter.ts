/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';
import {applyPatch} from 'diff';
import description from './description.json';
import {GameRecipeIOType} from './types/custom-game-data';
import type {Converter} from '../processing';

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
    GameData,
    GameRecipeIO,
} from '#types/game-data';

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
        isResource: boolean;
    }
    const mapIO = (item: JsonRecipeIO[] | JsonRecipeIO | undefined, {isResource}: RecipeIOOptions) => {
        if(!item)
            return [];
        const itemArray = Array.isArray(item) ? item : [item];

        //merge probability, copy objects
        const mappedMergedIO = new Map<string, GameRecipeIO>();
        for(const i of itemArray) {
            const count = i.Probability ? (i.Count * i.Probability) : i.Count;
            const i0 = mappedMergedIO.get(i.Name);
            if(!i0) {
                mappedMergedIO.set(i.Name, {
                    name: itemNameMapper(i.Name),
                    count: count,
                    hasProbability: i.Probability ? true : undefined,
                    type: isResource ? GameRecipeIOType.Resource : undefined,
                });
            } else {
                i0.count += count;
                if(i.Probability)
                    i0.hasProbability = true;
            }
        }

        return [...mappedMergedIO.values()];
    };
    const mapRecipes = (recipes: JsonRecipe[]) => (
        recipes.map((recipe) => {
            const input = [
                ...mapIO(recipe.Input, {isResource: false}),
                ...mapIO(recipe.ResourceInput, {isResource: true}),
            ];
            const output = [
                ...mapIO(recipe.Output, {isResource: false}),
                ...mapIO(recipe.ResourceOutput, {isResource: true}),
            ];

            const mappedRecipe = {
                name: recipe.Name,
                input: input.length ? input : undefined,
                output: output.length ? output : undefined,
                time: recipe.Ticks,
            };
            return mappedRecipe;
        })
    );

    return recipeDictionaries.map((recipeDictionary) => ({
        name: recipeDictionary.Name,
        recipes: mapRecipes(recipeDictionary.Recipes),
    }));
}

function convertItems(items: JsonItem[]) {
    const mapRecipe = (recipe?: JsonRecipeReference) => {
        if(!recipe)
            return undefined;
        return {
            recipeDictionary: recipe.RecipeDictionary,
            tier: recipe.Tier,
        };
    };

    return items.map((item) => ({
        name: itemNameMapper(item.Name),
        label: item.Label,
        image: imageNameMapper(item.Image),
        unitMul: (item.UnitMul == 1) ? undefined : item.UnitMul,
        recipe: mapRecipe(item.Recipe),
    }));
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

    const imagesJson: Images = JSON.parse(fs.readFileSync(path.join(__parsed, 'images.json'), 'utf8'));

    const gameData: GameData = {
        recipeDictionaries: convertRecipes(patchedDataJson.Recipes),
        items: convertItems(patchedDataJson.Items),
        images: Object.fromEntries(
            Object.entries(imagesJson).map(([key, value]) => [imageNameMapper(key), value]),
        ),
        description,
    };
    return gameData;
}

export function useConverter(): Converter {
    return {
        convertGameData,
        async loadImages() {
            return fs.readFileSync(path.join(__parsed, 'images.png'));
        },
    };
}
