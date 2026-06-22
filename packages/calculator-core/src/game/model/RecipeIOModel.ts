import { action, makeObservable, observable } from 'mobx';

import type { GameRecipeIOBase } from '../parser/index.js';
import { GameRecipeIOFlagsBase } from '../parser/index.js';
import { EdgeStatus } from './constants.js';
import type { IOLinkModelBaseImpl } from './IOLinkModel.js';
import { ItemModelBaseImpl } from './ItemModel.js';
import type { RecipeModelBaseImpl } from './RecipeModel.js';
import type { FactoryModelBase, IOLinkModelBase, RecipeIOModelBase } from './types.js';

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

        makeObservable<RecipeIOModelBaseImpl, '__links'>(this, {
            status: observable,
            __links: observable,
            __addLink: action,
            __deleteLink: action,
            __deleteAllLinks: action,
            __copySimilarLinksTo: action,
        });
    }

    get isHidden() {
        return !!((this.__io.flags ?? 0) & GameRecipeIOFlagsBase.Hidden);
    }
    get isFlipped() {
        return this.__recipe.__factory.isFlipped;
    }
    get factory(): FactoryModelBase {
        return this.__factory;
    }
    get __factory() {
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

    get links(): IterableIterator<IOLinkModelBase> {
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

    __findAlreadyLinked(target: RecipeIOModelBase) {
        for (const link of this.__links.values()) {
            if (link.__getOtherSide(this)?.itemId === target.itemId) return link;
        }
        return undefined;
    }

    __addLink(link: IOLinkModelBaseImpl) {
        this.__links.set(link.linkId, link);
    }
    __deleteLink(linkId: string) {
        this.__links.delete(linkId);
        return this.__factory;
    }
    __deleteAllLinks() {
        const __links = [...this.__links.values()];
        __links.forEach((link) => link.deleteLink());
    }
    __copySimilarLinksTo(targetIo: RecipeIOModelBaseImpl) {
        const __flowChart = this.__factory.__flowChart;
        for (const link of this.__links.values()) {
            const otherSide = link.__getOtherSide(this);
            if (!otherSide) continue;
            __flowChart.__createLink(otherSide.__factory, otherSide, targetIo.__factory, targetIo);
        }
    }
}
