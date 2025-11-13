import { action, makeObservable, observable } from 'mobx';

import type { GameItemBase, GameRecipeIOBase } from '../parser';
import { GameRecipeIOFlagsBase, isAbstractClassItem } from '../parser';
import type { IOLinkModelBaseImpl } from './IOLinkModel';
import { ItemModelBaseImpl } from './ItemModel';
import type { RecipeModelBaseImpl } from './RecipeModel';
import type { FactoryModelBase, RecipeIOModelBase } from './types';

export type CreateRecipeIOModel<
    REC extends RecipeModelBaseImpl = RecipeModelBaseImpl,
    IOJ extends GameRecipeIOBase = GameRecipeIOBase,
    IO extends RecipeIOModelBaseImpl = RecipeIOModelBaseImpl,
> = (__recipe: REC, __io: IOJ) => IO;

export abstract class RecipeIOModelBaseImpl extends ItemModelBaseImpl {
    selected = false;

    readonly isInput;

    protected readonly __io;
    protected readonly __recipe;
    protected __materializedAbstractItem: GameItemBase | undefined;
    protected readonly __links = new Map<string, IOLinkModelBaseImpl>();

    constructor(__recipe: RecipeModelBaseImpl, __io: GameRecipeIOBase) {
        super(__recipe.__factory.__flowChart, __io.product);

        this.__io = __io;
        this.__recipe = __recipe;
        this.isInput = __io.isInput;

        makeObservable<RecipeIOModelBaseImpl, '__materializedAbstractItem'>(this, {
            selected: observable,
            __materializedAbstractItem: observable,
            __addLink: action,
            __materializeAbstractItem: action,
        });
    }

    get isAbstractClassItem() {
        return isAbstractClassItem(this.__item);
    }
    get isMaterialized() {
        return !!this.__materializedAbstractItem;
    }
    get rawKey() {
        return this.__item?.key;
    }
    get isHidden() {
        return !!((this.__io.flags ?? 0) & GameRecipeIOFlagsBase.Hidden);
    }
    get isFlipped() {
        return this.__recipe.__factory.isFlipped;
    }
    get factory(): FactoryModelBase {
        return this.__recipe.__factory;
    }

    override get key() {
        return this.__materializedAbstractItem?.key ?? this.__item?.key;
    }
    override get label() {
        return this.__materializedAbstractItem?.label ?? this.__item?.label;
    }
    override get image() {
        return this.__materializedAbstractItem?.image ?? this.__item?.image;
    }

    get links() {
        return this.__links.values();
    }
    get linksCount() {
        return this.__links.size;
    }

    isConnectable(target: RecipeIOModelBase) {
        const sourceItem = !this.isAbstractClassItem || this.isMaterialized ? this.key : undefined;
        const targetItem = !target.isAbstractClassItem || target.isMaterialized ? target.key : undefined;
        if (sourceItem && targetItem) {
            return sourceItem === targetItem;
        }
        // cannot connect both unmaterialized abstract items
        if (this.isAbstractClassItem && target.isAbstractClassItem && !this.isMaterialized && !target.isMaterialized) {
            return false;
        }
        return this.type === target.type;
    }

    isAlreadyLinked(target: RecipeIOModelBase) {
        for (const link of this.__links.values()) {
            if (link.__getOtherSide(this)?.itemId === target.itemId) return true;
        }
        return false;
    }

    __addLink(link: IOLinkModelBaseImpl) {
        this.__links.set(link.linkId, link);
        if (this.isAbstractClassItem && this.__links.size === 1) {
            const item = link.__getOtherSide(this)?.__item;
            // dual io abstract items support
            if (item) {
                this.__recipe.__materializeAllAbstractItems(item);
            }
        }
    }

    __materializeAbstractItem(item: GameItemBase | undefined) {
        if (this.isAbstractClassItem) this.__materializedAbstractItem = item;
    }
}
