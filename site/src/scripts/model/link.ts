/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {ErrorCollector} from '../error-collector';
import {newColorClass, newKey} from './key-store';
import {LinkShapeDescriptor, LinkShapeModel, LinkShapeModelBuilder} from './link-shape';
import {LogisticSetModelImpl} from './logistic';
import type {SavedLink} from './saved-blueprint';
import type {LogisticSetModel, RecipeIOModel} from './store';


export class LinkModelImpl {
    private readonly _key;
    public readonly input?: RecipeIOModel;
    public readonly output?: RecipeIOModel;
    private _linkShape?: LinkShapeModel;
    private readonly _colorClass;
    private _flow: number | undefined;
    private readonly _logistic: LogisticSetModel;

    constructor(input?: RecipeIOModel, output?: RecipeIOModel, isTemporary?: boolean) {
        this.input = input;
        this.output = output;
        this._key = newKey();
        this._colorClass = newColorClass();
        this._logistic = LogisticSetModelImpl.createLogisticSet(this, isTemporary);
    }

    get key() { return this._key; }
    get colorClass() { return this._colorClass; }
    get flow() { return this._flow; }
    get logistic() { return this._logistic; }
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
    _$load(l: SavedLink, errorCollector: ErrorCollector) {
        //was used to load transport, now empty
    }

    setFlow(_flow?: number) {
        this._flow = _flow;
    }
}
