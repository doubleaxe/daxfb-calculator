import type {Images, JsonItem, JsonData, JsonRecipe, JsonRecipeIO} from './json-data-types';
import dataJsonUntyped from '../../../data/data.json';
import imagesJsonUntyped from '../../../data/images.json';

//immutable parsed JSON data for convenient and typed access
const dataJson = dataJsonUntyped as JsonData;
export const imagesJson = imagesJsonUntyped as Images;
Object.freeze(imagesJson);

type RecipeDictionary = Recipe[];
export const parsedItems = new Map<string, Item>();
export const parsedRecipes = new Map<string, RecipeDictionary>();
export type {Item, RecipeIO, Recipe, RecipeDictionary};

class Item {
    private readonly _item: JsonItem;
    private _recipeDictionary?: RecipeDictionary = undefined;
    constructor(name: string, _item: JsonItem) {
        _item.Name = name;
        this._item = _item;
        this.tier = _item.Recipe?.Tier || 0;
    }
    init() {
        const {_item} = this;
        if(_item.Recipe) {
            this._recipeDictionary = parsedRecipes.get(_item.Recipe?.RecipeDictionary || '');
        }
        Object.freeze(this._item);
        if(this._item.Recipe)
            Object.freeze(this._item.Recipe);
        Object.freeze(this);
    }

    get image() { return this._item.Image; }
    get name(): string { return this._item.Name || ''; }
    get label(): string { return this._item.Label; }
    public readonly tier;
    get recipeDictionary() { return this._recipeDictionary; }
}

class RecipeIO {
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

    public readonly item: Item;
    public readonly isInput;
    public readonly isResource;

    get tier() { return this._recipe.tier; }
    get ticks() { return this._recipe.ticks; }
    get count() { return this._io.Count; }
}

class Recipe {
    private readonly _recipe: JsonRecipe;
    private readonly _tier;
    public readonly input: RecipeIO[];
    public readonly output: RecipeIO[];
    constructor(recipe: JsonRecipe) {
        this._recipe = recipe;
        this._tier = recipe.Tier || -1;

        const mapIO = (item: JsonRecipeIO[] | JsonRecipeIO | undefined, options: {isInput: boolean; isResource: boolean}) => {
            if(!item)
                return [];
            const itemArray = Array.isArray(item) ? Object.freeze(item) : [item];
            return itemArray.map((i) => new RecipeIO(this, i, options));
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
    get tier() { return this._tier; }
    get ticks() { return this._recipe.Ticks; }
}

(() => {
    for(const [key, value] of Object.entries(dataJson.items)) {
        parsedItems.set(key, new Item(key, value));
    }

    for(const [key, value] of Object.entries(dataJson.recipes)) {
        const dictionary = value.map((r) => new Recipe(r));
        parsedRecipes.set(key, dictionary);
        Object.freeze(dictionary);
    }

    for(const item of parsedItems.values()) {
        item.init();
    }
})();
