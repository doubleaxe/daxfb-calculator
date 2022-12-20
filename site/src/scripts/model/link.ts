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
            this.input.linkAdded(this);
        if(this.output)
            this.output.linkAdded(this);
    }
    deletePersistentLink() {
        if(this.input)
            this.input.linkDeleted(this);
        if(this.output)
            this.output.linkDeleted(this);
    }
    getOtherSide(item: RecipeIOModel) {
        //may get proxy, so need to compare keys, not objects
        if(item.key === this.input?.key)
            return this.output;
        if(item.key === this.output?.key)
            return this.input;
        return undefined;
    }
}
