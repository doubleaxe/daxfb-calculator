/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';

import type {
    GameRecipeDictionarySerialized,
    GameItemSerialized,
    GameDataSerialized,
    GameLogisticSerialized,
} from '#types/game-data-serialized';

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
    private readonly gameData: GameDataSerialized;
    private readonly keyStorePath: string;
    private readonly keysJson: KeysJson;
    private readonly isAttachKeys?: boolean;

    constructor(gameData: GameDataSerialized, sourceDir: string, isRebuildKeys?: boolean, isAttachKeys?: boolean) {
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
        this.isAttachKeys = isAttachKeys;
    }
    async processKeys() {
        this.mergeRecipes();
        this.mergeItems();
        this.mergeLogistic();
        this.mergeImages();

        this.fixRecipeReferences();
        this.fixItemReferences();
        this.fixLogisticReferences();

        const reverceKeys = Object.fromEntries(Object.entries(this.keysJson.keys || {}).map(([name, key]) => [key, name]));
        fs.writeFileSync(this.keyStorePath, JSON.stringify(this.keysJson, null, '  '));
        return {
            gameData: this.gameData,
            reverceKeys,
        };
    }
    private mergeRecipes() {
        const sub0 = (sub: GameRecipeDictionarySerialized) => {
            const mappedObject = this.mapKeys(sub.recipes.map((recipe) => [recipe.name, recipe]));
            sub.recipes = mappedObject?.map(([key, recipe]) => {
                if(this.isAttachKeys) {
                    recipe.longName = recipe.name;
                }
                recipe.name = key;
                return recipe;
            }) || [];
            return sub;
        };
        const mappedArray: [string, GameRecipeDictionarySerialized][] = (this.gameData.recipeDictionaries || []).map(
            (r) => [r.name, r],
        );
        const mappedObject = this.mapKeys(mappedArray, sub0);
        this.gameData.recipeDictionaries = mappedObject?.map(([key, value]) => {
            if(this.isAttachKeys) {
                value.longName = value.name;
            }
            value.name = key;
            return value;
        }) || [];
    }
    private mergeItems() {
        const mappedArray: [string, GameItemSerialized][] = (this.gameData.items || []).map((r) => [r.name, r]);
        const mappedObject = this.mapKeys(mappedArray);
        this.gameData.items = mappedObject?.map(([key, value]) => {
            if(this.isAttachKeys) {
                value.longName = value.name;
            }
            value.name = key;
            return value;
        }) || [];
    }
    private mergeLogistic() {
        const mappedArray: [string, GameLogisticSerialized][] = (this.gameData.logistic || []).map((r) => [r.name, r]);
        const mappedObject = this.mapKeys(mappedArray);
        this.gameData.logistic = mappedObject?.map(([key, value]) => {
            if(this.isAttachKeys) {
                value.longName = value.name;
            }
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
                    if(this.isAttachKeys) {
                        i.longName = i.name;
                    }
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
                if(this.isAttachKeys) {
                    item.recipe.longRecipeDictionary = item.recipe.recipeDictionary;
                }
                item.recipe.recipeDictionary = nameMapping[item.recipe.recipeDictionary] || '';
            }
            if(item.prevTier) {
                item.prevTier = nameMapping[item.prevTier];
            }
            if(item.nextTier) {
                item.nextTier = nameMapping[item.nextTier];
            }
            item.cost?.forEach((cost) => {
                if(this.isAttachKeys) {
                    cost.longName = cost.name;
                }
                cost.name = nameMapping[cost.name] || '';
            });
        }
    }

    private fixLogisticReferences() {
        const nameMapping = this.keysJson.keys || {};
        for(const logistic of this.gameData.logistic || []) {
            for(const item of logistic.items) {
                if(this.isAttachKeys) {
                    item.longName = item.name;
                }
                item.name = nameMapping[item.name] || '';
            }
            for(const transport of logistic.transport) {
                if(this.isAttachKeys) {
                    transport.longName = transport.name;
                }
                transport.name = nameMapping[transport.name] || '';
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
