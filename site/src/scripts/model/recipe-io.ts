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

    get isInput() { return this._isInput; }
    get ownerItem() { return this._ownerItem; }
    get description() {
        return `${this._io.getCountPerSecond(this._ownerItem?.tier || 0).toFixed(2)}`;
    }

    linkAdded(value: LinkModel) {
        this._links.set(value.key, value);
    }
    linkDeleted(value: LinkModel) {
        this._links.delete(value.key);
    }
    copySimilarLinksTo(targetItem: RecipeIOModel) {
        for(const link of this._links.values()) {
            const otherSide = link.getOtherSide(this);
            if(!otherSide)
                continue;
            this.owner?.addLink(targetItem, otherSide);
        }
    }
    deleteAllLinks() {
        const linksCopy = [...this._links.values()];
        for(const link of linksCopy) {
            this.owner?.deleteLink(link);
        }
    }
    isAlreadyLinked(targetItem: RecipeIOModel) {
        for(const link of this._links.values()) {
            //may get proxy, so need to compare keys, not objects
            if(link.getOtherSide(this)?.key === targetItem.key)
                return true;
        }
        return false;
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
