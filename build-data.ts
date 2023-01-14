
import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {diff_match_patch as DiffMatchPatch} from 'diff-match-patch';

import type {
    Images,
    JsonData,
    JsonRecipe,
    JsonRecipeIO,
    KeysJson,
} from './data/json-data-types';

import type {
    JsonData as OptimizedJsonData,
    JsonRecipeIO as OptimizedJsonRecipeIO,
} from './site/src/scripts/data/json-data-types';

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));
const __parsed = path.join(__dirname, 'data', 'parsed');
const __static = path.join(__dirname, 'data', 'static');
const __target = path.join(__dirname, 'site', 'data');

const args = process.argv.slice(2);
let isRebuildKeys = false;
args.forEach((arg) => {
    if(arg == 'clean')
        isRebuildKeys = true;
});

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
        const diff = new DiffMatchPatch();
        let patches: ReturnType<typeof diff['patch_fromText']>;
        if(patchData[0] == '@') {
            patches = diff.patch_fromText(patchData);
        } else {
            patches = JSON.parse(patchData);
        }

        const [mergedData, results] = diff.patch_apply(patches, parsedDataJson);
        const failed = results.map((r, index) => [r, index]).filter(([r]) => !r).map(([r, index]) => index);
        if(failed.length) {
            throw new Error(`some patches failed to apply:\n${failed.join('\n')}`);
        }
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
        const sub0 = (sub: JsonRecipe[]) => {
            const mappedObject = this.mapKeys(sub.map((recipe) => [recipe.Name, recipe]));
            return mappedObject?.map(([key, recipe]) => {
                recipe.Name = key;
                return recipe;
            }) || [];
        };
        const mappedObject = this.mapKeys(Object.entries(this.mergedDataJson.recipes || {}), undefined, sub0);
        this.mergedDataJson.recipes = Object.fromEntries(mappedObject || []);
    }
    private mergeItems() {
        const mappedObject = this.mapKeys(Object.entries(this.mergedDataJson.items || {}), MergeKeys.itemNameMapper);
        this.mergedDataJson.items = Object.fromEntries(mappedObject || []);
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
        for(const recipes of Object.values(this.mergedDataJson.recipes || {})) {
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
        for(const item of Object.values(this.mergedDataJson.items || {})) {
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
    optimize(): OptimizedJsonData {
        return {
            recipes: this.optimizeRecipes(),
            items: this.optimizeItems(),
            images: this.mergedDataJson.images || {},
        };
    }

    optimizeRecipes() {
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
        const optimizedRecipes: OptimizedJsonData['recipes'] = {};
        for(const [key, recipes] of Object.entries(this.mergedDataJson.recipes || {})) {
            optimizedRecipes[key] = recipes.map((recipe) => ({
                Name: recipe.Name,
                Input: mapIOArray(recipe.Input),
                Output: mapIOArray(recipe.Output),
                ResourceInput: mapIO(recipe.ResourceInput),
                ResourceOutput: mapIO(recipe.ResourceOutput),
                Ticks: recipe.Ticks,
                Tier: recipe.Tier,
            }));
        }
        return optimizedRecipes;
    }
    optimizeItems() {
        const optimizedItems: OptimizedJsonData['items'] = {};
        for(const [key, item] of Object.entries(this.mergedDataJson.items || {})) {
            optimizedItems[key] = {
                Name: item.Name,
                Label: item.Label,
                Image: item.Image,
                Tier: item.Tier,
                UnitMul: item.UnitMul,
                Recipe: item.Recipe,
            };
        }
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

    const optimizedData = new OptimizeData(mergedDataJson).optimize();
    fs.writeFileSync(path.join(__target, 'data.json'), JSON.stringify(optimizedData));

    const images = fs.readFileSync(path.join(__parsed, 'images.png'));
    fs.writeFileSync(path.join(__target, 'images.png'), images);
})().catch((err) => console.error(err.stack));
