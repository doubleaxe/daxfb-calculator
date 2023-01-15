import {newKey} from './key-store';
import {LinkShapeModelImpl} from './link-shape';
import type {SavedLink} from './saved-blueprint';
import type {LinkShapeModel, RecipeIOModel} from './store';

export class LinkModelImpl {
    private readonly _key;
    public readonly input?: RecipeIOModel;
    public readonly output?: RecipeIOModel;
    private _linkShape?: LinkShapeModel;

    constructor(input?: RecipeIOModel, output?: RecipeIOModel) {
        this.input = input;
        this.output = output;
        this._key = newKey();
    }

    get key() { return this._key; }
    buildShape() {
        let linkShape: LinkShapeModel = new LinkShapeModelImpl(this.input?.rect, this.output?.rect, false);
        if(this._linkShape?.isEqual(linkShape)) {
            linkShape = this._linkShape;
        } else {
            this._linkShape = linkShape;
        }
        return linkShape.buildShape();
    }

    _$applyPersistentLink() {
        if(this.input)
            this.input._$linkAdded(this);
        if(this.output)
            this.output._$linkAdded(this);
    }
    _$deletePersistentLink() {
        if(this.input)
            this.input._$linkDeleted(this);
        if(this.output)
            this.output._$linkDeleted(this);
    }
    getOtherSide(item: RecipeIOModel) {
        //may get proxy, so need to compare keys, not objects
        if(item.key === this.input?.key)
            return this.output;
        if(item.key === this.output?.key)
            return this.input;
        return undefined;
    }
    _$save(input?: number, output?: number): SavedLink {
        return {
            l: [
                input || 0,
                output || 0,
            ]
        };
    }
}
