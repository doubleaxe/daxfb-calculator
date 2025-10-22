import { action, computed, makeObservable } from 'mobx';

import type { GameItemBase, GameRecipeIOBase } from '../parser';
import type { FactoryModelBaseImpl } from './FactoryModel';
import type { CreateRecipeIOModel, RecipeIOModelBaseImpl } from './RecipeIOModel';
import type { RecipeIOModelBase } from './types';

export type CreateRecipeModel<
    FACT extends FactoryModelBaseImpl = FactoryModelBaseImpl,
    REC extends RecipeModelBaseImpl = RecipeModelBaseImpl,
> = (__factory: FACT, key: string) => REC;

export abstract class RecipeModelBaseImpl {
    readonly __factory;
    protected readonly __recipe;
    protected readonly __input: RecipeIOModelBaseImpl[];
    protected readonly __output: RecipeIOModelBaseImpl[];
    protected readonly __itemsById;

    protected readonly __ioConstructor: CreateRecipeIOModel;

    constructor(__factory: FactoryModelBaseImpl, key: string, __ioConstructor: CreateRecipeIOModel) {
        this.__ioConstructor = __ioConstructor;
        this.__factory = __factory;
        const recipe = __factory.__getRecipe(key);
        this.__recipe = recipe;

        this.__input = recipe?.input.map((io: GameRecipeIOBase) => __ioConstructor(this, io)) ?? [];
        this.__output = recipe?.output.map((io: GameRecipeIOBase) => __ioConstructor(this, io)) ?? [];

        const items = [...this.__input, ...this.__output];
        this.__itemsById = new Map(items.map((io) => [io.itemId, io]));

        makeObservable(this, {
            visibleInput: computed,
            invisibleInput: computed,
            visibleOutput: computed,
            invisibleOutput: computed,
            __materializeAllAbstractItems: action,
        });
    }

    get key() {
        return this.__recipe?.key;
    }
    get input(): IterableIterator<RecipeIOModelBase> {
        return this.__input[Symbol.iterator]();
    }
    get output(): IterableIterator<RecipeIOModelBase> {
        return this.__output[Symbol.iterator]();
    }

    get visibleInput(): RecipeIOModelBase[] {
        return this.__input.filter((item) => !item.isHidden);
    }
    get invisibleInput(): RecipeIOModelBase[] {
        return this.__input.filter((item) => item.isHidden);
    }
    get visibleOutput(): RecipeIOModelBase[] {
        return this.__output.filter((item) => !item.isHidden);
    }
    get invisibleOutput(): RecipeIOModelBase[] {
        return this.__output.filter((item) => item.isHidden);
    }

    __getIO(itemId: string) {
        return this.__itemsById.get(itemId);
    }

    __materializeAllAbstractItems(item: GameItemBase | undefined) {
        const items = [...this.__input, ...this.__output];
        if (item) {
            // link is added, materialize all io
            for (const io of items) {
                io.__materializeAbstractItem(item);
            }
        } else {
            // link is removed, if no links are left - dematerialize all io
            const haveLinks = items.some((io) => io.linksCount);
            if (!haveLinks) {
                for (const io of items) {
                    io.__materializeAbstractItem(undefined);
                }
            }
        }
    }
}
