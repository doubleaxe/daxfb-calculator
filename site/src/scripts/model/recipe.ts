import {RecipeIOModelImpl} from './recipe-io';
import type {Recipe} from '../data/data';
import type {BlueprintItemModel, RecipeIOModel} from './store';
import {reactive} from 'vue';

export class RecipeModelImpl {
    private readonly _recipe;
    public readonly input: RecipeIOModel[];
    public readonly output: RecipeIOModel[];
    public readonly itemsByKey;

    constructor(ownerItem: BlueprintItemModel, recipe: Recipe) {
        this._recipe = recipe;
        this.input = recipe.input.map((io) => reactive(new RecipeIOModelImpl(io, {ownerItem})));
        this.output = recipe.output.map((io) => reactive(new RecipeIOModelImpl(io, {ownerItem})));

        const items = [...this.input, ...this.output];
        this.itemsByKey = new Map(items.map((io) => [io.key, io]));
    }

    findMaybeTarget(sourceIo: RecipeIOModel) {
        const targetArray = sourceIo.isInput ? this.output : this.input;
        return targetArray.find((io) => io.name === sourceIo.name);
    }

    get name() { return this._recipe.name; }
}
