
import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {applyPatch} from 'diff';

import type {
    Images,
    JsonData,
    JsonItem,
    JsonRecipeDictionary,
    JsonRecipeIO,
    KeysJson,
} from './data/json-data-types';

import type {
    JsonData as OptimizedJsonData,
    JsonRecipeIO as OptimizedJsonRecipeIO,
} from './site/src/scripts/data/json-data-types';

//GAME=evospace npm run build-data
//GAME=evospace npm run dev
const args = process.argv.slice(2);
const game = process.env['GAME'] || 'example';
let isRebuildKeys = false;
args.forEach((arg) => {
    if(arg == 'clean')
        isRebuildKeys = true;
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __parsed = path.join(__dirname, 'data', game, 'parsed');
const __static = path.join(__dirname, 'data', game, 'static');
const __target = path.join(__dirname, 'site', 'data');

class MergeData {
    private readonly parsedDataJson;
    private readonly patchData;
    private readonly imagesJson;

    constructor(parsedDataJson: string, patchData: string, imagesJson: Images) {
        this.parsedDataJson = parsedDataJson;
        this.patchData = patchData;
        this.imagesJson = imagesJson;
    }
    merge(): JsonData {
        const mergedDataJson = this.mergeData();
        mergedDataJson.images = this.imagesJson;
        return mergedDataJson;
    }
    private mergeData() {
        const {
            parsedDataJson,
            patchData,
        } = this;
        const mergedData = applyPatch(parsedDataJson, patchData);
        const mergedDataJson: JsonData = JSON.parse(mergedData);
        return mergedDataJson;
    }
}

//we need to keep keys persistent across runs, so if new name is added - new key will be created for it
//if name is deleted - key is kept in place
//because keys will be saved - this way we make saves compatible even if further items added/removed
class MergeKeys {
    private readonly mergedDataJson;
    private readonly keysJson;

    constructor(mergedDataJson: JsonData, keysJson: KeysJson) {
        this.mergedDataJson = mergedDataJson;
        this.keysJson = keysJson;
    }
    merge() {
        this.mergeRecipes();
        this.mergeItems();
        this.mergeImages();

        this.fixRecipeReferences();
        this.fixItemReferences();

        const reverceKeys = Object.fromEntries(Object.entries(this.keysJson.keys || {}).map(([name, key]) => [key, name]));
        return {
            reverceKeys,
        };
    }
    private mergeRecipes() {
        const sub0 = (sub: JsonRecipeDictionary) => {
            const mappedObject = this.mapKeys(sub.Recipes.map((recipe) => [recipe.Name, recipe]));
            sub.Recipes = mappedObject?.map(([key, recipe]) => {
                recipe.Name = key;
                return recipe;
            }) || [];
            return sub;
        };
        const mappedArray: [string, JsonRecipeDictionary][] = (this.mergedDataJson.recipes || []).map((r) => [r.Name, r]);
        const mappedObject = this.mapKeys(mappedArray, undefined, sub0);
        this.mergedDataJson.recipes = mappedObject?.map(([key, value]) => {
            value.Name = key;
            return value;
        }) || [];
    }
    private mergeItems() {
        const mappedArray: [string, JsonItem][] = (this.mergedDataJson.items || []).map((r) => [r.Name, r]);
        const mappedObject = this.mapKeys(mappedArray, MergeKeys.itemNameMapper);
        this.mergedDataJson.items = mappedObject?.map(([key, value]) => {
            value.Name = key;
            return value;
        }) || [];
    }
    private mergeImages() {
        const mappedObject = this.mapKeys(Object.entries(this.mergedDataJson.images || {}), MergeKeys.imageNameMapper);
        this.mergedDataJson.images = Object.fromEntries(mappedObject || []);
    }
    private mapKeys<T>(object?: [string, T][], nameMapper?: (name: string) => string, recursive?: (sub: T) => T) {
        if(!object)
            return undefined;
        const uniqueNames = new Set<string>();
        const mappedObject: [string, T][] = object.map(([name, sub]) => {
            if(nameMapper)
                name = nameMapper(name);
            if(uniqueNames.has(name))
                throw new Error(`Duplicate name ${name}`);
            uniqueNames.add(name);
            const key = this.getKey(name);
            if(recursive && sub) {
                sub = recursive(sub);
            }
            return [key, sub];
        });
        return mappedObject;
    }

    private fixRecipeReferences() {
        const nameMapping = this.keysJson.keys || {};
        for(const {Recipes: recipes} of this.mergedDataJson.recipes || []) {
            for(const recipe of recipes) {
                const io = [
                    ...(recipe.Input ? recipe.Input : []),
                    ...(recipe.Output ? recipe.Output : []),
                    ...(recipe.ResourceInput ? [recipe.ResourceInput] : []),
                    ...(recipe.ResourceOutput ? [recipe.ResourceOutput] : []),
                ];
                for(const i of io) {
                    i.Name = nameMapping[MergeKeys.itemNameMapper(i.Name)] || '';
                }
            }
        }
    }
    private fixItemReferences() {
        const nameMapping = this.keysJson.keys || {};
        for(const item of this.mergedDataJson.items || []) {
            item.Image = nameMapping[MergeKeys.imageNameMapper(item.Image)] || '';
            if(item.Recipe) {
                item.Recipe.RecipeDictionary = nameMapping[item.Recipe.RecipeDictionary] || '';
            }
        }
    }

    private static readonly staticItem = 'StaticItem';
    private static readonly itemNameMapper = function(name: string) {
        if(name.lastIndexOf(MergeKeys.staticItem) == (name.length - MergeKeys.staticItem.length))
            name = name.substring(0, name.length - MergeKeys.staticItem.length);
        return name;
    };
    private static readonly imageNameMapper = function(name: string) {
        if(name.indexOf('T_') == 0)
            name = name.substring(2);
        return name;
    };

    private static readonly CHARS = [...'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    private static readonly CHARS_LENGTH = this.CHARS.length;
    private static encodeKey(key: number) {
        let ret = '';
        do {
            ret = this.CHARS[key % this.CHARS_LENGTH] + ret;
            key = Math.floor(key / this.CHARS_LENGTH);
        } while(key > 0);
        return ret;
    }
    private getKey(name: string) {
        const {keysJson} = this;
        if(!keysJson.keys)
            keysJson.keys = {};
        let key = keysJson.keys[name];
        if(!key) {
            if(keysJson.lastKey === undefined)
                keysJson.lastKey = -1;
            key = MergeKeys.encodeKey(++keysJson.lastKey);
            keysJson.keys[name] = key;
        }
        return key;
    }
}

class OptimizeData {
    private readonly mergedDataJson;

    constructor(mergedDataJson: JsonData) {
        this.mergedDataJson = mergedDataJson;
    }
    optimize(reverceKeys: {[k: string]: string}): OptimizedJsonData {
        return {
            recipes: this.optimizeRecipes(reverceKeys),
            items: this.optimizeItems(reverceKeys),
            images: this.mergedDataJson.images || {},
        };
    }

    optimizeRecipes(reverceKeys: {[k: string]: string}) {
        const mapIO = (io?: JsonRecipeIO): OptimizedJsonRecipeIO | undefined => {
            if(!io)
                return io;
            return {
                Name: io.Name,
                Count: io.Count,
                Probability: io.Probability,
            };
        };
        const mapIOArray = (io?: JsonRecipeIO[]): OptimizedJsonRecipeIO[] | undefined => {
            if(!io || !io.length)
                return undefined;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return io.map((i) => mapIO(i!)!);
        };
        const optimizedDictionary: OptimizedJsonData['recipes'] = [];
        for(const dictionary of this.mergedDataJson.recipes || []) {
            const optimizedRecipes = dictionary.Recipes.map((recipe) => ({
                Name: recipe.Name,
                Input: mapIOArray(recipe.Input),
                Output: mapIOArray(recipe.Output),
                ResourceInput: mapIO(recipe.ResourceInput),
                ResourceOutput: mapIO(recipe.ResourceOutput),
                Ticks: recipe.Ticks,
                Tier: recipe.Tier,
            }));
            optimizedDictionary.push({
                Name: dictionary.Name,
                Recipes: optimizedRecipes,
            });
        }
        /*
        optimizedDictionary.sort((a1, a2) => (reverceKeys[a1.Name] || a1.Name).localeCompare(reverceKeys[a2.Name] || a2.Name));
        */
        return optimizedDictionary;
    }
    optimizeItems(reverceKeys: {[k: string]: string}) {
        const optimizedItems: OptimizedJsonData['items'] = [];
        for(const item of this.mergedDataJson.items) {
            const item0 = {
                Name: item.Name,
                Label: item.Label,
                Image: item.Image,
                Tier: item.Tier,
                UnitMul: item.UnitMul,
                Recipe: item.Recipe,
            };
            optimizedItems.push(item0);
        }
        /*
        optimizedItems.sort((a1, a2) => (reverceKeys[a1.Name] || a1.Name).localeCompare(reverceKeys[a2.Name] || a2.Name));
        */
        return optimizedItems;
    }
}

(async function() {
    fs.mkdirSync(__target, {recursive: true});

    const parsedDataJson: string = fs.readFileSync(path.join(__parsed, 'data.json'), 'utf8');
    const patchData: string = fs.readFileSync(path.join(__static, 'data.patch'), 'utf8');
    const imagesJson: Images = JSON.parse(fs.readFileSync(path.join(__parsed, 'images.json'), 'utf8'));

    const mergedDataJson = new MergeData(parsedDataJson, patchData, imagesJson).merge();

    let keysJson: KeysJson = {};
    try {
        if(!isRebuildKeys)
            keysJson = JSON.parse(fs.readFileSync(path.join(__static, 'keys.json'), 'utf8'));
    } catch(err) {
        if((err as NodeJS.ErrnoException).code != 'ENOENT')
            throw err;
    }
    const {reverceKeys} = new MergeKeys(mergedDataJson, keysJson).merge();
    fs.writeFileSync(path.join(__static, 'keys.json'), JSON.stringify(keysJson, null, '  '));
    fs.writeFileSync(path.join(__target, 'keys.json'), JSON.stringify(reverceKeys));

    const optimizedData = new OptimizeData(mergedDataJson).optimize(reverceKeys);
    fs.writeFileSync(path.join(__target, 'data.json'), JSON.stringify(optimizedData));

    const images = fs.readFileSync(path.join(__parsed, 'images.png'));
    fs.writeFileSync(path.join(__target, 'images.png'), images);
})().catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
