import {reactive} from 'vue';
import type {RecipeIO} from '../data/data';
import {Rect} from '../geometry';
import {ItemModelImpl} from './item';
import type {BlueprintItemModel, BlueprintModel, LinkModel, RecipeIOModel} from './store';

type RecipeIOOptions = {
    owner?: BlueprintModel;
    ownerItem?: BlueprintItemModel;
    isReverce?: boolean;
};

export class RecipeIOModelImpl extends ItemModelImpl {
    private readonly _io;
    private readonly _ownerItem;
    private readonly _isInput;
    private readonly _links;

    constructor(
        io: RecipeIO,
        {owner, ownerItem, isReverce}: RecipeIOOptions,
        key?: string
    ) {
        super(owner || ownerItem?.owner, io.item, key);
        this._io = io;
        this._ownerItem = ownerItem;
        this._isInput = isReverce ? !io.isInput : io.isInput;
        this._links = new Map<string, LinkModel>();
    }

    get links() { return this._links; }
    get isInput() { return this._isInput; }
    get ownerItem() { return this._ownerItem; }
    get description() {
        return `${this._io.getCountPerSecond(this._ownerItem?.tier || 0).toFixed(2)}`;
    }

    addLink(value: LinkModel) {
        this._links.set(value.key, value);
    }
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
