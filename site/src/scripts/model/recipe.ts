import {RecipeIOModelImpl} from './recipe-io';
import type {Recipe} from '../data/data';
import type {BlueprintItemModel, RecipeIOModel} from './store';
import {reactive} from 'vue';

export class RecipeModelImpl {
    private readonly _recipe;
    public readonly input: RecipeIOModel[];
    public readonly output: RecipeIOModel[];
    public readonly items;

    constructor(ownerItem: BlueprintItemModel, recipe: Recipe) {
        this._recipe = recipe;
        this.input = recipe.input.map((io) => reactive(new RecipeIOModelImpl(io, {ownerItem})));
        this.output = recipe.output.map((io) => reactive(new RecipeIOModelImpl(io, {ownerItem})));
        this.items = new Map([...this.input, ...this.output].map((io) => [io.key, io]));
    }
}
