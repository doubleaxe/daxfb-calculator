
import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import type {
    Images,
    JsonData,
    JsonRecipe,
    SingleKeyJson,
    SingleKeysJson,
    KeysJson,
} from './data/json-data-types';

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));
const __parsed = path.join(__dirname, 'data', 'parsed');
const __static = path.join(__dirname, 'data', 'static');
const __target = path.join(__dirname, 'site', 'data');

const args = process.argv.slice(2);
let isMinimize = true;
let isRebuildKeys = false;
args.forEach((arg) => {
    if(arg == 'dev')
        isMinimize = false;
    if(arg == 'clean')
        isRebuildKeys = true;
});

class MergeData {
    private readonly parsedDataJson;
    private readonly staticDataJson;

    constructor(parsedDataJson: JsonData, staticDataJson: JsonData) {
        this.parsedDataJson = parsedDataJson;
        this.staticDataJson = staticDataJson;
    }
    merge(): JsonData {
        this.mergeRecipes();
        return this.parsedDataJson;
    }
    private mergeRecipes() {
        const parsedRecipes = this.parsedDataJson.recipes;
        const staticRecipes = this.staticDataJson.recipes;
        if(!parsedRecipes || !staticRecipes)
            return;
        for(const [id, dictionary] of Object.entries(staticRecipes)) {
            parsedRecipes[id] = dictionary;
        }
    }
}

interface ParsedKeys {
    lastKey: number;
    entries: Map<string, {
        key: string;
        used: boolean;
        sub?: ParsedKeys;
    }>;
}

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
    }
    private mergeRecipes() {
        const sub = (subKeys: ParsedKeys, sub: JsonRecipe[]) => {
            MergeKeys.mergeKeys(subKeys, sub.map((recipe) => [recipe.Name, null]));
        };
        const parsedKeys = MergeKeys.parseKeysMap(this.keysJson.recipes);
        MergeKeys.mergeKeys(parsedKeys, Object.entries(this.mergedDataJson.recipes || {}), sub);
        this.keysJson.recipes = MergeKeys.makeKeysFromMap(parsedKeys);
    }
    private mergeItems() {
        const parsedKeys = MergeKeys.parseKeysMap(this.keysJson.items);
        MergeKeys.mergeKeys(parsedKeys, Object.entries(this.mergedDataJson.items || {}));
        this.keysJson.items = MergeKeys.makeKeysFromMap(parsedKeys);
    }
    private mergeImages() {
        const parsedKeys = MergeKeys.parseKeysMap(this.keysJson.images);
        MergeKeys.mergeKeys(parsedKeys, Object.entries(this.mergedDataJson.images || {}));
        this.keysJson.images = MergeKeys.makeKeysFromMap(parsedKeys);
    }
    private static mergeKeys<T>(parsedKeys?: ParsedKeys, object?: [string, T][], recursive?: (parsedKeys: ParsedKeys, sub: T) => void) {
        if(!parsedKeys || !object)
            return;
        let lastKey = parsedKeys.lastKey;
        for(const [id, sub] of object) {
            let keyEntry = parsedKeys.entries.get(id);
            if(!keyEntry) {
                keyEntry = {key: this.encodeKey(++lastKey), used: false};
                parsedKeys.entries.set(id, keyEntry);
            }
            if(keyEntry.used)
                throw new Error(`Duplicate name ${id}`);
            keyEntry.used = true;
            if(recursive) {
                const keySub = keyEntry.sub || this.parseKeysMap({});
                if(keySub) {
                    keyEntry.sub = keySub;
                    recursive(keySub, sub);
                }
            }
        }
        parsedKeys.lastKey = lastKey;
    }

    private static CHARS = [...'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    private static CHARS_LENGTH = this.CHARS.length;
    private static encodeKey(key: number) {
        let ret = '';
        do {
            ret = this.CHARS[key % this.CHARS_LENGTH] + ret;
            key = Math.floor(key / this.CHARS_LENGTH);
        } while(key > 0);
        return ret;
    }

    private static parseKeysMap(keys?: SingleKeysJson): ParsedKeys | undefined {
        if(!keys)
            return undefined;
        return {
            lastKey: keys.lastKey || -1,
            entries: new Map((keys.keys || []).map((key) => [
                key.name,
                {key: key.key, used: false, sub: this.parseKeysMap(key.sub)}
            ])),
        };
    }
    private static makeKeysFromMap(parsedKeys?: ParsedKeys): SingleKeysJson {
        if(!parsedKeys)
            return {};
        return {
            lastKey: parsedKeys.lastKey,
            keys: [...parsedKeys.entries].map(([name, value]) => {
                const result: SingleKeyJson = {
                    name: name,
                    key: value.key,
                };
                if(value.sub)
                    result.sub = this.makeKeysFromMap(value.sub);
                return result;
            })
        };
    }
}

class OptimizeData {
    private readonly mergedDataJson;

    constructor(mergedDataJson: JsonData) {
        this.mergedDataJson = mergedDataJson;
    }
    optimize() {
        return this.mergedDataJson;
    }
}

(async function() {
    fs.mkdirSync(__target, {recursive: true});

    const parsedDataJson: JsonData = JSON.parse(fs.readFileSync(path.join(__parsed, 'data.json'), 'utf8'));
    const staticDataJson: JsonData = JSON.parse(fs.readFileSync(path.join(__static, 'data.json'), 'utf8'));
    const imagesJson: Images = JSON.parse(fs.readFileSync(path.join(__parsed, 'images.json'), 'utf8'));

    parsedDataJson.images = imagesJson;
    const mergedDataJson = new MergeData(parsedDataJson, staticDataJson).merge();

    let keysJson: KeysJson = {
        recipes: {},
        items: {},
        images: {},
    };
    try {
        if(!isRebuildKeys)
            keysJson = JSON.parse(fs.readFileSync(path.join(__static, 'keys.json'), 'utf8'));
    } catch(err) {
        if((err as NodeJS.ErrnoException).code != 'ENOENT')
            throw err;
    }
    new MergeKeys(mergedDataJson, keysJson).merge();
    fs.writeFileSync(path.join(__static, 'keys.json'), JSON.stringify(keysJson));

    const optimizedData = new OptimizeData(mergedDataJson).optimize();
    fs.writeFileSync(path.join(__target, 'data.json'), JSON.stringify(optimizedData, undefined, isMinimize ? undefined : '  '));

    const images = fs.readFileSync(path.join(__parsed, 'images.png'));
    fs.writeFileSync(path.join(__target, 'images.png'), images);
})().catch((err) => console.error(err.stack));
