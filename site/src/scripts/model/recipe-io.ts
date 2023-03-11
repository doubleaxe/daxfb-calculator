/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItem, GameRecipeIO} from '#types/game-data';
import {Rect, type PublicRect} from '../geometry';
import {ItemModelImpl} from './item';
import type {
    BlueprintItemModel,
    BlueprintModel,
    LinkModel,
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
    private _matherializeAbstractItem: GameItem | undefined;

    constructor(
        io: GameRecipeIO,
        {owner, ownerItem, isReverce}: RecipeIOOptions,
    ) {
        super(owner || ownerItem?.owner, io.product);
        this._io = io;
        this._ownerItem = ownerItem;
        this._isInput = isReverce ? !io.isInput : io.isInput;
        this._links = new Map<string, LinkModel>();

        const ownerGameItem = ownerItem?._$getItem();
        if(ownerGameItem !== undefined) {
            this._cpsMax = this._io.getCountPerSecond(ownerGameItem);
        } else {
            //temp link
            this._cpsMax = 0;
        }
    }

    //in client coordinates related to blueprint panel
    get rect(): PublicRect { return this._rect; }
    setRect(rect: PublicRect) { this._rect = rect; }
    get isInput() { return this._isInput; }
    get ownerItem() { return this._ownerItem; }
    get links() { return this._links.values(); }
    get isFlipped() { return this._ownerItem?.isFlipped || this._isFlipped; }

    get isAbstractClassItem() { return this._item?.isAbstractClassItem || false; }
    get isMatherialized() { return !!this._matherializeAbstractItem; }

    get name() { return this._matherializeAbstractItem?.name || this._item?.name; }
    get label() { return this._matherializeAbstractItem?.label || this._item?.label; }
    get image() { return this._matherializeAbstractItem?.image || this._item?.image || ''; }

    setFlipped(isFlipped: boolean) {
        if(this._ownerItem)
            throw new Error('Cannot set flipped');
        this._isFlipped = isFlipped;
    }

    _$matherializeAbstractItem(item: GameItem | undefined) {
        if(this.isAbstractClassItem)
            this._matherializeAbstractItem = item;
    }

    _$linkAdded(value: LinkModel) {
        this._links.set(value.key, value);
        if(this.isAbstractClassItem && (this._links.size === 1)) {
            this._matherializeAbstractItem = value.getOtherSide(this)?._$getItem();
        }
    }
    _$linkDeleted(value: LinkModel) {
        this._links.delete(value.key);
        if(!this._links.size) {
            this._matherializeAbstractItem = undefined;
        }
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
        this._matherializeAbstractItem = undefined;
    }
    isAlreadyLinked(targetItem: RecipeIOModel) {
        for(const link of this._links.values()) {
            //may get proxy, so need to compare keys, not objects
            if(link.getOtherSide(this)?.key === targetItem.key)
                return true;
        }
        return false;
    }
    createTempLink() {
        const clone = new RecipeIOModelImpl(this._io, {owner: this.owner, isReverce: true});
        clone.setRect(this._rect);
        clone._$matherializeAbstractItem(this._matherializeAbstractItem);
        const link = this.owner?._$createTempLink(this, clone);
        return {
            link,
            target: clone,
        };
    }
    get cpsMax() { return this._cpsMax; }
    get cpsMaxTotal() { return this._cpsMax * (this._ownerItem?.count || 1); }
    get cpsSolvedTotal() { return (this._ownerItem?.solvedCount !== undefined) ? this._cpsMax * this._ownerItem?.solvedCount : undefined; }
    formatCountPerSecond(count: number) { return this._io.formatCountPerSecond(count); }
}
