import type {Images, JsonItem, JsonData, JsonRecipe, JsonRecipeIO} from '../../data';
import dataJsonUntyped from '../../data/data.json';
import imagesJsonUntyped from '../../data/images.json';

const dataJson = dataJsonUntyped as JsonData;
export const imagesJson = imagesJsonUntyped as Images;

const parsedItems = new Map<string, Item>();
const parsedRecipes = new Map<string, RecipeDictionary>();

export class Item {
    private readonly item: JsonItem;
    private readonly tier;
    private _recipeDictionary?: RecipeDictionary = undefined;
    constructor(name: string, item: JsonItem) {
        item.Name = name;
        this.item = item;
        this.tier = item.Recipe?.Tier || 0;
    }
    init() {
        const {item} = this;
        if(item.Recipe) {
            this._recipeDictionary = parsedRecipes.get(item.Recipe?.RecipeDictionary || '');
        }
    }

    get image() { return this.item.Image; }
    get name(): string { return this.item.Name || ''; }
    get label(): string { return this.item.Label; }
    get hasRecipes(): boolean { return !!this._recipeDictionary; }
    get recipes() { return this._recipeDictionary?.forTier(this.tier); }
}

export class RecipeIO {
    private readonly io: JsonRecipeIO;
    public readonly item: Item;
    public readonly isInput;
    constructor(io: JsonRecipeIO, isInput: boolean) {
        this.io = io;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.item = parsedItems.get(io.Name)!;
        this.isInput = isInput;
    }
}

export class Recipe {
    private readonly recipe: JsonRecipe;
    private readonly _tier;
    public readonly input: RecipeIO[];
    public readonly output: RecipeIO[];
    constructor(recipe: JsonRecipe) {
        this.recipe = recipe;
        this._tier = recipe.Tier || -1;

        const input = [...(recipe.Input || []), ...(recipe.ResourceInput ? [recipe.ResourceInput] : [])];
        this.input = input.map((i) => new RecipeIO(i, true));
        const output = [...(recipe.Output || []), ...(recipe.ResourceOutput ? [recipe.ResourceOutput] : [])];
        this.output = output.map((o) => new RecipeIO(o, false));
    }

    get name(): string { return this.recipe.Name; }
    get tier() { return this._tier; }
}

export class RecipeDictionary {
    private readonly recipes;
    private readonly tier;
    //cache (not recursive)
    private readonly recipesForTier;
    private constructor(recipes: Recipe[], tier?: number) {
        this.recipes = new Map(recipes.map((r) => [r.name, r]));
        this.tier = tier;
        this.recipesForTier = new Map<number, RecipeDictionary>();
    }
    static newInstance(dictionary: JsonRecipe[]) {
        return new RecipeDictionary(dictionary.map((r) => new Recipe(r)));
    }
    forTier(tier: number) {
        if(this.tier) {
            return (tier === this.tier) ? this : null;
        }
        let recipesForTier = this.recipesForTier.get(tier);
        if(!recipesForTier) {
            recipesForTier = new RecipeDictionary(
                [...this.recipes.values()].filter((r) => (tier >= r.tier)),
                tier,
            );
            this.recipesForTier.set(tier, recipesForTier);
        }
        return recipesForTier;
    }
    get firstRecipe() { return this.recipes.values().next().value as Recipe; }
}

class ItemCollection {
    private readonly producerItems: Item[] = [];
    constructor() {
        for(const item of parsedItems.values()) {
            item.init();
            if(item.hasRecipes) {
                this.producerItems.push(item);
            }
        }
    }
    getProducerItems() {
        return this.producerItems.concat();
    }
    getItem(name: string) {
        return parsedItems.get(name);
    }
    getRecipeDictionary(name: string) {
        return parsedRecipes.get(name);
    }
}

(() => {
    for(const [key, value] of Object.entries(dataJson.items)) {
        parsedItems.set(key, new Item(key, value));
    }

    for(const [key, value] of Object.entries(dataJson.recipes)) {
        parsedRecipes.set(key, RecipeDictionary.newInstance(value));
    }
})();

export const itemCollection = new ItemCollection();
