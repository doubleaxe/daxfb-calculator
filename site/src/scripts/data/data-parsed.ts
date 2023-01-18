import type {JsonItem, JsonData, JsonRecipe, JsonRecipeIO} from './json-data-types';
import dataJsonUntyped from '../../../data/data.json';
import type {InterfaceOf} from '../types';

//immutable parsed JSON data for convenient and typed access
const dataJson = dataJsonUntyped as JsonData;
export const imagesJson = dataJson.images;
Object.freeze(imagesJson);

export type Item = InterfaceOf<ItemImpl>;
export type RecipeIO = InterfaceOf<RecipeIOImpl>;
export type Recipe = InterfaceOf<RecipeImpl>;
export type RecipeDictionary = InterfaceOf<RecipeDictionaryImpl>;
export type RecipeDictionaryArray = Recipe[];

export const parsedItems = new Map<string, Item>();
export const parsedRecipes = new Map<string, RecipeDictionary>();

class ItemImpl {
    private readonly _item: JsonItem;
    private _recipeDictionary?: RecipeDictionary = undefined;
    constructor(_item: JsonItem) {
        this._item = _item;
        this.tier = _item.Recipe?.Tier || 0;
        this.lowerLabel = _item.Label.toLowerCase();
    }
    init() {
        const {_item} = this;
        if(_item.Recipe) {
            this._recipeDictionary = parsedRecipes.get(_item.Recipe?.RecipeDictionary || '');
            this._recipeDictionary?.initItem(this);
        }
        Object.freeze(this._item);
        if(this._item.Recipe)
            Object.freeze(this._item.Recipe);
        Object.freeze(this);
        return this;
    }

    get image() { return this._item.Image; }
    get name(): string { return this._item.Name || ''; }
    get label(): string { return this._item.Label; }
    public readonly tier;
    public readonly lowerLabel;
    get recipeDictionary() { return this._recipeDictionary; }
    get multiplexor() { return this._item.UnitMul; }
}

class RecipeIOImpl {
    private readonly _recipe: Recipe;
    private readonly _io: JsonRecipeIO;
    constructor(recipe: Recipe, _io: JsonRecipeIO, {isInput, isResource}: {isInput: boolean; isResource: boolean}) {
        this._recipe = recipe;
        this._io = _io;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.item = parsedItems.get(_io.Name)!;
        this.isInput = isInput;
        this.isResource = isResource;
        Object.freeze(this._io);
        Object.freeze(this);
    }

    //for item gives item/seconds
    //for resource gives Watts
    getCountPerSecond(producerTier: number) {
        producerTier = Math.max(producerTier, 1);
        const recipeTier = Math.max(this._recipe.minItemTier, 1);
        let tierDiff = producerTier - recipeTier;
        if(tierDiff < 0) {
            try {
                console.error(`Something wrong, item tier ${producerTier} < recipe tier ${recipeTier} => ${this._recipe.name}`);
            } catch(err) { /**/ }
            tierDiff = 0;
        }
        if(this.isResource) {
            //1 Resource Item [R] * 20 = 20 Watt, time doesn't matter
            //each tier doubles energy consuption/production (cumulative)
            return this.count * 20 * Math.pow(2, tierDiff);
        }
        //each tier makes production 1.5x times faster (cumulative)
        const multiplexor = this.item.multiplexor || 1;
        return (this.count * multiplexor) / (this._recipe.seconds / Math.pow(1.5, tierDiff));
    }

    public readonly item: Item;
    public readonly isInput;
    public readonly isResource;

    get count() { return this._io.Count; }
}

class RecipeImpl {
    private readonly _dictionary: RecipeDictionary;
    private readonly _recipe: JsonRecipe;
    public readonly input: RecipeIO[];
    public readonly output: RecipeIO[];
    public readonly seconds;
    constructor(dictionary: RecipeDictionary, recipe: JsonRecipe) {
        this._dictionary = dictionary;
        this._recipe = recipe;
        this.tier = recipe.Tier || -1;
        //1 Second = 20 Ticks
        this.seconds = recipe.Ticks / 20;

        const mapIO = (item: JsonRecipeIO[] | JsonRecipeIO | undefined, options: {isInput: boolean; isResource: boolean}) => {
            if(!item)
                return [];
            const itemArray = Array.isArray(item) ? Object.freeze(item) : [item];
            return itemArray.map((i) => new RecipeIOImpl(this, i, options));
        };
        this.input = [
            ...mapIO(recipe.Input, {isInput: true, isResource: false}),
            ...mapIO(recipe.ResourceInput, {isInput: true, isResource: true}),
        ];
        this.output = [
            ...mapIO(recipe.Output, {isInput: false, isResource: false}),
            ...mapIO(recipe.ResourceOutput, {isInput: false, isResource: true}),
        ];
        Object.freeze(this._recipe);
        Object.freeze(this.input);
        Object.freeze(this.output);
        Object.freeze(this);
    }

    get name(): string { return this._recipe.Name; }
    public readonly tier;
    get minItemTier() { return this._dictionary.minItemTier; }
}

class RecipeDictionaryImpl {
    public readonly recipes: RecipeDictionaryArray;
    public readonly items: Item[];
    constructor(recipes: JsonRecipe[]) {
        this.recipes = recipes.map((r) => new RecipeImpl(this, r));
        this.items = [];
    }
    initItem(item: Item) {
        this.items.push(item);
    }
    init() {
        this.items.sort((i1, i2) => i1.tier - i2.tier);
        Object.freeze(this.recipes);
        Object.freeze(this.items);
        Object.freeze(this);
        return this;
    }
    getForTier(tier: number) { return this.recipes.filter((r) => (tier >= r.tier)); }

    get minItemTier() { return this.items[0]?.tier || 0; }
}


(() => {
    for(const value of dataJson.items) {
        parsedItems.set(value.Name, new ItemImpl(value));
    }

    for(const value of dataJson.recipes) {
        parsedRecipes.set(value.Name, new RecipeDictionaryImpl(value.Recipes));
    }

    for(const item of parsedItems.values()) {
        item.init();
    }

    for(const item of parsedRecipes.values()) {
        item.init();
    }
})();
