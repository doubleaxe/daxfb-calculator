import {RecipeIOModelImpl} from './recipe-io';
import type {Recipe} from '../data-parsed';
import type {BlueprintItemModel, RecipeIOModel} from './types';

export class RecipeModelImpl {
    private readonly _recipe;
    public readonly input: RecipeIOModel[];
    public readonly output: RecipeIOModel[];
    public readonly items;

    constructor(owner: BlueprintItemModel, recipe: Recipe) {
        this._recipe = recipe;
        this.input = recipe.input.map((io) => new RecipeIOModelImpl(owner, io));
        this.output = recipe.output.map((io) => new RecipeIOModelImpl(owner, io));
        this.items = new Map([...this.input, ...this.output].map((io) => [io.key, io]));
    }
}
