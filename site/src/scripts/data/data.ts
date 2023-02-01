/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {
    parsedItems,
    imagesJson,
    newItemRecipeDictionary,
    parsedDescription,
} from './data-parsed';
import type {Item, RecipeIO, Recipe, RecipeDictionary, RecipeDictionaryArray, ItemRecipeDictionary} from './data-parsed';
export type {Item, RecipeIO, Recipe, RecipeDictionary, RecipeDictionaryArray, ItemRecipeDictionary};

const EMPTY_RECIPE_DICTIONARY = newItemRecipeDictionary();
class DataProvider {
    private readonly allItems;
    private readonly producerItems;
    private readonly itemRecipeDictionary;
    constructor() {
        this.allItems = [...parsedItems.values()];
        Object.freeze(this.allItems);
        this.producerItems = this.allItems.filter((item) => item.recipeDictionary);
        Object.freeze(this.producerItems);
        this.itemRecipeDictionary = new Map<Item, ItemRecipeDictionary>();
    }
    getItemImageDef(key: string) {
        return imagesJson[key];
    }
    getAllItems() {
        return this.allItems;
    }
    getProducerItems() {
        return this.producerItems;
    }
    getItem(name: string) {
        return parsedItems.get(name);
    }
    getRecipesForItem(item?: Item): ItemRecipeDictionary {
        if(!item?.recipeDictionary)
            return EMPTY_RECIPE_DICTIONARY;

        let itemRecipeDictionary = this.itemRecipeDictionary.get(item);
        if(!itemRecipeDictionary) {
            itemRecipeDictionary = newItemRecipeDictionary(item);
            this.itemRecipeDictionary.set(item, itemRecipeDictionary);
        }
        return itemRecipeDictionary;
    }
    getDescription() {
        return parsedDescription;
    }
}

export const dataProvider = new DataProvider();
