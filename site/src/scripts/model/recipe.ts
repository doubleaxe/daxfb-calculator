import {RecipeIOModelImpl} from './recipe-io';
import type {Recipe} from '../data/data';
import type {BlueprintItemModel, RecipeIOModel, RecipeModel} from './store';
import {reactive} from 'vue';

export class RecipeModelImpl {
    private readonly _recipe;
    private readonly _input: RecipeIOModel[];
    private readonly _output: RecipeIOModel[];
    private readonly _itemsByKey;

    constructor(ownerItem: BlueprintItemModel, recipe: Recipe) {
        this._recipe = recipe;
        this._input = recipe.input.map((io) => reactive(new RecipeIOModelImpl(io, {ownerItem})));
        this._output = recipe.output.map((io) => reactive(new RecipeIOModelImpl(io, {ownerItem})));

        const items = [...this._input, ...this._output];
        this._itemsByKey = new Map(items.map((io) => [io.key, io]));
    }

    findSimilarIo(sourceIo: RecipeIOModel, reverce: boolean) {
        const isInput = reverce ? !sourceIo.isInput : sourceIo.isInput;
        const targetArray = isInput ? this._input : this._output;
        return targetArray.find((io) => io.name === sourceIo.name);
    }
    _$copySimilarLinksTo(targetRecipe: RecipeModel) {
        for(const targetItem of targetRecipe.items) {
            const similarItem = this.findSimilarIo(targetItem, false);
            if(!similarItem)
                continue;
            similarItem._$copySimilarLinksTo(targetItem);
        }
    }
    _$deleteAllLinks() {
        for(const item of this.items) {
            item._$deleteAllLinks();
        }
    }

    get name() { return this._recipe.name; }
    get input() { return this._input[Symbol.iterator](); }
    get inputCount() { return this._input.length; }
    get output() { return this._output[Symbol.iterator](); }
    get outputCount() { return this._output.length; }
    itemByKey(key: string) { return this._itemsByKey.get(key); }
    get items() { return this._itemsByKey.values(); }
}
