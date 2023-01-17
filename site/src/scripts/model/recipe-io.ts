import type {RecipeIO} from '../data/data';
import {Rect} from '../geometry';
import {ItemModelImpl} from './item';
import type {
    BlueprintItemModel,
    BlueprintModel,
    LinkModel,
    PublicRect,
    RecipeIOModel,
} from './store';

type RecipeIOOptions = {
    owner?: BlueprintModel;
    ownerItem?: BlueprintItemModel;
    isReverce?: boolean;
};

export class RecipeIOModelImpl extends ItemModelImpl {
    private _rect: PublicRect = Rect.assign();
    private readonly _io;
    private readonly _ownerItem;
    private readonly _isInput;
    private readonly _links;
    private readonly _cpsMax;
    private _isFlipped = false;

    constructor(
        io: RecipeIO,
        {owner, ownerItem, isReverce}: RecipeIOOptions,
    ) {
        super(owner || ownerItem?.owner, io.item);
        this._io = io;
        this._ownerItem = ownerItem;
        this._isInput = isReverce ? !io.isInput : io.isInput;
        this._links = new Map<string, LinkModel>();

        if(this._ownerItem) {
            this._cpsMax = this._io.getCountPerSecond(this._ownerItem.tier || 0);
        } else {
            //temp link
            this._cpsMax = 0;
        }
    }

    get rect(): PublicRect { return this._rect; }
    set rect(rect: PublicRect) {
        this._rect = rect;
    }
    get isInput() { return this._isInput; }
    get isResource() { return this._io.isResource; }
    get ownerItem() { return this._ownerItem; }
    get links() { return this._links.values(); }
    get isFlipped() { return this._ownerItem?.isFlipped || this._isFlipped; }

    setFlipped(isFlipped: boolean) {
        if(this._ownerItem)
            throw new Error('Cannot set flipped');
        this._isFlipped = isFlipped;
    }

    _$linkAdded(value: LinkModel) {
        this._links.set(value.key, value);
    }
    _$linkDeleted(value: LinkModel) {
        this._links.delete(value.key);
    }
    _$copySimilarLinksTo(targetItem: RecipeIOModel) {
        for(const link of this._links.values()) {
            const otherSide = link.getOtherSide(this);
            if(!otherSide)
                continue;
            this.owner?._$addLink(targetItem, otherSide);
        }
    }
    _$deleteAllLinks() {
        const linksCopy = [...this._links.values()];
        for(const link of linksCopy) {
            this.owner?._$deleteLink(link);
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
    createTempLink(): RecipeIOModel {
        const clone = new RecipeIOModelImpl(this._io, {owner: this.owner, isReverce: true});
        clone.rect = this.calculateRect();
        this.owner?._$createTempLink(this, clone);
        return clone;
    }
    calculateRect(): PublicRect {
        if(!this._ownerItem)
            return this.rect;
        return this.rect.offsetBy(this._ownerItem.rect);
    }
    get cpsMax() { return this._cpsMax; }
    get cpsMaxTotal() { return this._cpsMax * (this._ownerItem?.count || 1); }
    get cpsSolvedTotal() { return (this._ownerItem?.solvedCount !== undefined) ? this._cpsMax * this._ownerItem?.solvedCount : undefined; }
}
