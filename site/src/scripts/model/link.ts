import type {RecipeIOModel} from './types';

export class LinkModelImpl {
    public readonly input: RecipeIOModel;
    public readonly output: RecipeIOModel;

    constructor(input: RecipeIOModel, output: RecipeIOModel) {
        this.input = input;
        this.output = output;
        input.link = this;
        output.link = this;
    }
}
