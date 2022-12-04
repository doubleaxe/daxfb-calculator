import {RecipeIOModel} from './recipe-io';
import type {Recipe} from '../data-parsed';

export class RecipeModel {
    private readonly _recipe;
    public readonly input: RecipeIOModel[];
    public readonly output: RecipeIOModel[];

    constructor(recipe: Recipe) {
        this._recipe = recipe;
        this.input = recipe.input.map((io) => new RecipeIOModel(io));
        this.output = recipe.output.map((io) => new RecipeIOModel(io));
    }
}
