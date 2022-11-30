import type {Images, JsonItem, JsonData, JsonRecipe, JsonRecipeIO} from '../../data';
import dataJsonUntyped from '../../data/data.json';
import imagesJsonUntyped from '../../data/images.json';

const dataJson = dataJsonUntyped as JsonData;
export const imagesJson = imagesJsonUntyped as Images;

const parsedItems = new Map<string, Item>();
const parsedRecipes = new Map<string, RecipeDictionary>();

export class Item {
    protected readonly item: JsonItem;
    constructor(name: string, item: JsonItem) {
        item.Name = name;
        this.item = item;
    }

    get image() { return this.item.Image; }
    get name(): string { return this.item.Name || ''; }
    get isProducer() { return false; }
    get asProducer() { return undefined as ProducerFactory | undefined; }
}

export class RecipeIO {
    private readonly io: JsonRecipeIO;
    public readonly item: Item;
    constructor(io: JsonRecipeIO) {
        this.io = io;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.item = parsedItems.get(io.Name)!;
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
        this.input = input.map((i) => new RecipeIO(i));
        const output = [...(recipe.Output || []), ...(recipe.ResourceOutput ? [recipe.ResourceOutput] : [])];
        this.output = output.map((o) => new RecipeIO(o));
    }

    get name(): string { return this.recipe.Name; }
    get tier() { return this._tier; }
}

export class RecipeDictionary {
    private readonly recipes;
    private constructor(recipes: Recipe[]) {
        this.recipes = new Map(recipes.map((r) => [r.name, r]));
    }
    static newInstance(dictionary: JsonRecipe[]) {
        return new RecipeDictionary(dictionary.map((r) => new Recipe(r)));
    }
    forTier(tier: number) {
        return new RecipeDictionary([...this.recipes.values()].filter((r) => (tier >= r.tier)));
    }
    get firstRecipe() { return this.recipes.values().next().value as Recipe; }
}

export class ProducerFactory extends Item {
    private readonly tier;
    private _allRecipes?: RecipeDictionary = undefined;
    private _recipes?: RecipeDictionary = undefined;
    constructor(name: string, item: JsonItem) {
        super(name, item);
        this.tier = item.Recipe?.Tier || 0;
    }
    init() {
        const {item} = this;
        this._allRecipes = parsedRecipes.get(item.Recipe?.RecipeDictionary || '');
    }
    get isProducer() { return true; }
    get asProducer() { return this; }
    get recipes() {
        if(!this._recipes)
            this._recipes = this._allRecipes?.forTier(this.tier);
        return this._recipes;
    }
}

class ItemCollection {
    private readonly producerItems: ProducerFactory[] = [];
    constructor() {
        for(const value of parsedItems.values()) {
            if(value.isProducer) {
                const producer = value as ProducerFactory;
                producer.init();
                this.producerItems.push(producer);
            }
        }
    }
    getProducerItems() {
        return this.producerItems.concat();
    }
    getItem(name: string) {
        return parsedItems.get(name);
    }
}

(() => {
    for(const [key, value] of Object.entries(dataJson.items)) {
        let item: Item;
        if(value.Recipe) {
            item = new ProducerFactory(key, value);
        } else {
            item = new Item(key, value);
        }
        parsedItems.set(key, item);
    }

    for(const [key, value] of Object.entries(dataJson.recipes)) {
        parsedRecipes.set(key, RecipeDictionary.newInstance(value));
    }
})();

export const itemCollection = new ItemCollection();
