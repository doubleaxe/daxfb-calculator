import { action, makeObservable, observable } from 'mobx';

import type { GameRecipeIOBase } from '../parser/index.js';
import { GameRecipeIOFlagsBase } from '../parser/index.js';
import { EdgeStatus } from './constants.js';
import type { IOLinkModelBaseImpl } from './IOLinkModel.js';
import { ItemModelBaseImpl } from './ItemModel.js';
import type { RecipeModelBaseImpl } from './RecipeModel.js';
import type { FactoryModelBase, RecipeIOModelBase } from './types.js';

export type CreateRecipeIOModel<
    REC extends RecipeModelBaseImpl = RecipeModelBaseImpl,
    IOJ extends GameRecipeIOBase = GameRecipeIOBase,
    IO extends RecipeIOModelBaseImpl = RecipeIOModelBaseImpl,
> = (__recipe: REC, __io: IOJ) => IO;

export abstract class RecipeIOModelBaseImpl extends ItemModelBaseImpl {
    public status: EdgeStatus = EdgeStatus.None;

    readonly isInput;

    protected readonly __io;
    protected readonly __recipe;
    protected readonly __links = new Map<string, IOLinkModelBaseImpl>();

    constructor(__recipe: RecipeModelBaseImpl, __io: GameRecipeIOBase) {
        super(__recipe.__factory.__flowChart, __io.product);

        this.__io = __io;
        this.__recipe = __recipe;
        this.isInput = __io.isInput;

        makeObservable<RecipeIOModelBaseImpl>(this, {
            status: observable,
            __addLink: action,
        });
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
        return this.__item?.key;
    }
    override get label() {
        return this.__item?.label;
    }
    override get image() {
        return this.__item?.image;
    }

    get links() {
        return this.__links.values();
    }
    get linksCount() {
        return this.__links.size;
    }

    isConnectable(target: RecipeIOModelBase) {
        const sourceItem = this.key;
        const targetItem = target.key;
        return sourceItem === targetItem;
    }

    isAlreadyLinked(target: RecipeIOModelBase) {
        for (const link of this.__links.values()) {
            if (link.__getOtherSide(this)?.itemId === target.itemId) return true;
        }
        return false;
    }

    __addLink(link: IOLinkModelBaseImpl) {
        this.__links.set(link.linkId, link);
    }
}
