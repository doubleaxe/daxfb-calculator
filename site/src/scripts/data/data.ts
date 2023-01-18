import {
    parsedItems,
    imagesJson,
} from './data-parsed';
import type {Item, RecipeIO, Recipe, RecipeDictionary, RecipeDictionaryArray} from './data-parsed';
export type {Item, RecipeIO, Recipe, RecipeDictionary, RecipeDictionaryArray};

class DataProvider {
    private readonly allItems;
    private readonly producerItems;
    private readonly recipesForItem;
    constructor() {
        this.allItems = [...parsedItems.values()];
        this.producerItems = this.allItems.filter((item) => item.recipeDictionary);
        this.recipesForItem = new Map<Item, RecipeDictionaryArray>();
    }
    getItemImageDef(key: string) {
        return imagesJson[key];
    }
    getAllItems() {
        return this.allItems.concat();
    }
    getProducerItems() {
        return this.producerItems.concat();
    }
    getItem(name: string) {
        return parsedItems.get(name);
    }
    getRecipesForItem(item?: Item): RecipeDictionaryArray {
        if(!item?.recipeDictionary)
            return [];
        let recipesForItem = this.recipesForItem.get(item);
        if(!recipesForItem) {
            recipesForItem = item.recipeDictionary.getForTier(item.tier);
            this.recipesForItem.set(item, recipesForItem);
        }
        return recipesForItem;
    }
}

export const dataProvider = new DataProvider();
