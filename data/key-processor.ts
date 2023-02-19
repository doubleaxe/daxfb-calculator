/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';

import type {
    GameRecipeDictionary,
    GameItem,
    GameData,
} from '#types/game-data';

interface KeysJson {
    keys?: {
        [key: string]: string;
    };
    lastKey?: number;
}

//we need to keep keys persistent across runs, so if new name is added - new key will be created for it
//if name is deleted - key is kept in place
//because keys will be saved - this way we make saves compatible even if further items added/removed
export class KeyProcessor {
    private readonly gameData: GameData;
    private readonly keyStorePath: string;
    private readonly keysJson: KeysJson;

    constructor(gameData: GameData, sourceDir: string, isRebuildKeys?: boolean) {
        this.gameData = gameData;
        this.keyStorePath = path.join(sourceDir, 'keys.json');

        let keysJson: KeysJson = {};
        try {
            if(!isRebuildKeys)
                keysJson = JSON.parse(fs.readFileSync(this.keyStorePath, 'utf8'));
        } catch(err) {
            if((err as NodeJS.ErrnoException).code != 'ENOENT')
                throw err;
        }
        this.keysJson = keysJson;
    }
    async processKeys() {
        this.mergeRecipes();
        this.mergeItems();
        this.mergeImages();

        this.fixRecipeReferences();
        this.fixItemReferences();

        const reverceKeys = Object.fromEntries(Object.entries(this.keysJson.keys || {}).map(([name, key]) => [key, name]));
        fs.writeFileSync(this.keyStorePath, JSON.stringify(this.keysJson, null, '  '));
        return {
            gameData: this.gameData,
            reverceKeys,
        };
    }
    private mergeRecipes() {
        const sub0 = (sub: GameRecipeDictionary) => {
            const mappedObject = this.mapKeys(sub.recipes.map((recipe) => [recipe.name, recipe]));
            sub.recipes = mappedObject?.map(([key, recipe]) => {
                recipe.name = key;
                return recipe;
            }) || [];
            return sub;
        };
        const mappedArray: [string, GameRecipeDictionary][] = (this.gameData.recipeDictionaries || []).map((r) => [r.name, r]);
        const mappedObject = this.mapKeys(mappedArray, sub0);
        this.gameData.recipeDictionaries = mappedObject?.map(([key, value]) => {
            value.name = key;
            return value;
        }) || [];
    }
    private mergeItems() {
        const mappedArray: [string, GameItem][] = (this.gameData.items || []).map((r) => [r.name, r]);
        const mappedObject = this.mapKeys(mappedArray);
        this.gameData.items = mappedObject?.map(([key, value]) => {
            value.name = key;
            return value;
        }) || [];
    }
    private mergeImages() {
        const mappedObject = this.mapKeys(Object.entries(this.gameData.images || {}));
        this.gameData.images = Object.fromEntries(mappedObject || []);
    }
    private mapKeys<T>(object?: [string, T][], recursive?: (sub: T) => T) {
        if(!object)
            return undefined;
        const uniqueNames = new Set<string>();
        const mappedObject: [string, T][] = object.map(([name, sub]) => {
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
        for(const {recipes} of this.gameData.recipeDictionaries || []) {
            for(const recipe of recipes) {
                const io = [
                    ...(recipe.input ? recipe.input : []),
                    ...(recipe.output ? recipe.output : []),
                ];
                for(const i of io) {
                    i.name = nameMapping[i.name] || '';
                }
            }
        }
    }
    private fixItemReferences() {
        const nameMapping = this.keysJson.keys || {};
        for(const item of this.gameData.items || []) {
            item.image = nameMapping[item.image] || '';
            if(item.recipe) {
                item.recipe.recipeDictionary = nameMapping[item.recipe.recipeDictionary] || '';
            }
        }
    }

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
            key = KeyProcessor.encodeKey(++keysJson.lastKey);
            keysJson.keys[name] = key;
        }
        return key;
    }
}
