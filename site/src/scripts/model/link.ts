import newKey from './key-store';
import type {RecipeIOModel} from './store';

export class LinkModelImpl {
    private readonly _key;
    public readonly input?: RecipeIOModel;
    public readonly output?: RecipeIOModel;

    constructor(input?: RecipeIOModel, output?: RecipeIOModel) {
        this.input = input;
        this.output = output;
        this._key = newKey();
    }

    get key() { return this._key; }

    applyPersistentLink() {
        if(this.input)
            this.input.link = this;
        if(this.output)
            this.output.link = this;
    }
}
