import type {RecipeIOModel} from './recipe-io';

export class LinkModel {
    public readonly input: RecipeIOModel;
    public readonly output: RecipeIOModel;

    constructor(input: RecipeIOModel, output: RecipeIOModel) {
        this.input = input;
        this.output = output;
        input.link = this;
        output.link = this;
    }
}
