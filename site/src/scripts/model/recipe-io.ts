import {reactive} from 'vue';
import type {RecipeIO} from '../data/data';
import {Rect} from '../geometry';
import {ItemModelImpl} from './item';
import type {BlueprintItemModel, BlueprintModel, LinkModel, RecipeIOModel} from './store';

export class RecipeIOModelImpl extends ItemModelImpl {
    private readonly _ownerItem;
    private readonly _io;
    private readonly _isInput;
    private _link?: LinkModel;

    constructor(
        io: RecipeIO,
        {owner, ownerItem, isReverce}: {owner?: BlueprintModel; ownerItem?: BlueprintItemModel; isReverce?: boolean} = {},
        key?: string
    ) {
        super(owner || ownerItem?.owner, io.item, key);
        this._io = io;
        this._ownerItem = ownerItem;
        this._isInput = isReverce ? !io.isInput : io.isInput;
    }

    get link() { return this._link; }
    set link(value: LinkModel | undefined) { this._link = value; }
    get isInput() { return this._isInput; }
    get ownerItem() { return this._ownerItem; }

    tempClone(isReverce?: boolean): RecipeIOModel {
        const clone = reactive(new RecipeIOModelImpl(this._io, {owner: this.owner, isReverce}));
        clone.rect.assignRect(this.calculateRect());
        return clone;
    }
    calculateRect() {
        if(!this._ownerItem)
            return this.rect;
        return new Rect(this.rect).offsetBy(this._ownerItem.rect);
    }
}
