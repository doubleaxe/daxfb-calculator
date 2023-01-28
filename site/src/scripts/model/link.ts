import {newColorClass, newKey} from './key-store';
import {LinkShapeDescriptor, LinkShapeModel, LinkShapeModelBuilder} from './link-shape';
import type {SavedLink} from './saved-blueprint';
import type {RecipeIOModel} from './store';


export class LinkModelImpl {
    private readonly _key;
    public readonly input?: RecipeIOModel;
    public readonly output?: RecipeIOModel;
    private _linkShape?: LinkShapeModel;
    private readonly _colorClass;

    constructor(input?: RecipeIOModel, output?: RecipeIOModel) {
        this.input = input;
        this.output = output;
        this._key = newKey();
        this._colorClass = newColorClass();
    }

    get key() { return this._key; }
    get colorClass() { return this._colorClass; }
    buildShape() {
        const descriptor = new LinkShapeDescriptor(
            this.input?.rect,
            this.output?.rect,
            this.input?.isFlipped,
            this.output?.isFlipped,
        );
        if(!this._linkShape?.descriptor?.isEqual(descriptor)) {
            this._linkShape = new LinkShapeModelBuilder(descriptor).buildShape();
        }
        return this._linkShape.shape;
    }
    deleteThis() {
        const owner = (this.input || this.output)?.owner;
        if(owner)
            owner._$deleteLink(this);
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
            ],
        };
    }
}
