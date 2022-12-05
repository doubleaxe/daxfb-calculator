import {RecipeIOModel} from './recipe-io';
import type {ItemModel} from './item';
import type {Recipe} from '../data-parsed';

export class RecipeModel {
    private readonly _recipe;
    public readonly input: RecipeIOModel[];
    public readonly output: RecipeIOModel[];
    public readonly items;

    constructor(owner: ItemModel, recipe: Recipe) {
        this._recipe = recipe;
        this.input = recipe.input.map((io) => new RecipeIOModel(owner, io));
        this.output = recipe.output.map((io) => new RecipeIOModel(owner, io));
        this.items = new Map([...this.input, ...this.output].map((io) => [io.key, io]));
    }
}
