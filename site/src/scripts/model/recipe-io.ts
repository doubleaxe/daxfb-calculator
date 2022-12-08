import {reactive} from 'vue';
import type {RecipeIO} from '../data-parsed';
import {ItemModelImpl} from './item';
import type {BlueprintItemModel, LinkModel} from './types';


export class RecipeIOModelImpl extends ItemModelImpl {
    private readonly _owner;
    private readonly _io;
    private readonly _isInput;
    private _link?: LinkModel;

    constructor(io: RecipeIO, owner?: BlueprintItemModel, key?: string, isReverce?: boolean) {
        super(io.item, key);
        this._io = io;
        this._owner = owner;
        this._isInput = isReverce ? !io.isInput : io.isInput;
    }

    get link() { return this._link; }
    set link(value: LinkModel | undefined) { this._link = value; }
    get isInput() { return this._isInput; }

    tempClone(isReverce?: boolean) {
        const clone = reactive(new RecipeIOModelImpl(this._io, undefined, undefined, isReverce));
        clone.x = this.x;
        clone.y = this.y;
        return clone;
    }
}
