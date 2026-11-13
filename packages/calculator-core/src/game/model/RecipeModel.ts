import type { ErrorCollector } from '#core/utils/ErrorCollector.js';

import type { GameRecipeIOBase } from '../parser/index.js';
import type { FactoryModelBaseImpl } from './FactoryModel.js';
import type { IOLinkModelBaseImpl } from './IOLinkModel.js';
import type { CreateRecipeIOModel, RecipeIOModelBaseImpl } from './RecipeIOModel.js';
import type { SerializedLink, SerializedOrder } from './SerializedModel.js';
import type { RecipeIOModelBase } from './types.js';

export type CreateRecipeModel<
    FACT extends FactoryModelBaseImpl = FactoryModelBaseImpl,
    REC extends RecipeModelBaseImpl = RecipeModelBaseImpl,
> = (__factory: FACT, key: string) => REC;

export abstract class RecipeModelBaseImpl {
    readonly __factory;
    protected readonly __recipe;
    protected readonly __input: RecipeIOModelBaseImpl[];
    protected readonly __output: RecipeIOModelBaseImpl[];
    protected readonly __itemsArray;
    protected readonly __itemsById;
    protected readonly __itemsByKey;

    protected readonly __ioConstructor: CreateRecipeIOModel;

    constructor(__factory: FactoryModelBaseImpl, key: string, __ioConstructor: CreateRecipeIOModel) {
        this.__ioConstructor = __ioConstructor;
        this.__factory = __factory;
        const recipe = __factory.__getRecipe(key);
        this.__recipe = recipe;

        this.__input = recipe?.input.map((io: GameRecipeIOBase) => __ioConstructor(this, io)) ?? [];
        this.__output = recipe?.output.map((io: GameRecipeIOBase) => __ioConstructor(this, io)) ?? [];

        const items = [...this.__input, ...this.__output];
        this.__itemsArray = items;
        this.__itemsById = new Map(items.map((io) => [io.itemId, io]));
        this.__itemsByKey = new Map(items.map((io) => [io.key, io]));
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
    get ports(): IterableIterator<RecipeIOModelBase> {
        return this.__itemsArray[Symbol.iterator]();
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

    __getIOById(itemId: string) {
        return this.__itemsById.get(itemId);
    }
    __getIOByKey(key: string) {
        return this.__itemsByKey.get(key);
    }
    __findConnectable(target: RecipeIOModelBase) {
        const otherSide = target.isInput ? this.__output : this.__input;
        return otherSide.find((io) => io.isConnectable(target));
    }
    __findAlreadyLinked(target: RecipeIOModelBase) {
        const otherSide = target.isInput ? this.__output : this.__input;
        return otherSide.find((io) => io.__findAlreadyLinked(target));
    }
    __deleteAllLinks() {
        this.__itemsArray.forEach((io) => io.__deleteAllLinks());
    }
    __copySimilarLinksTo(targetRecipe: RecipeModelBaseImpl) {
        for (const targetIo of targetRecipe.__itemsArray) {
            const possibleSimilarIo = targetIo.isInput ? this.__input : this.__output;
            const similarIo = possibleSimilarIo.find((io) => io.key === targetIo.key);
            if (!similarIo) continue;
            similarIo.__copySimilarLinksTo(targetIo);
        }
    }

    __loadLink(l: SerializedLink, outputRecipe: RecipeModelBaseImpl, errorCollector: ErrorCollector) {
        let inputIoArray = [...(this.__input ?? [])];
        let outputIoArray = [...(outputRecipe.__output ?? [])];
        if (!inputIoArray.length || !outputIoArray.length) return undefined;
        //if we can link by multiple paths for same item - then link is ambiguous
        //we should restore saved name
        if (l.n) {
            inputIoArray = inputIoArray.filter((io) => io.key === l.n);
            outputIoArray = outputIoArray.filter((io) => io.key === l.n);
        }
        let link: IOLinkModelBaseImpl | undefined;
        for (const inputIo of inputIoArray) {
            const maybeTarget = outputIoArray.find((io) => io.key === inputIo.key);
            if (maybeTarget) {
                link = this.__factory.__flowChart?.__createLink(
                    inputIo.__recipe.__factory,
                    inputIo,
                    maybeTarget.__recipe.__factory,
                    maybeTarget
                );
                break;
            }
        }
        if (!link) {
            errorCollector.collectError(
                `Cannot load link "${outputRecipe.__factory.label}" => "${this.__factory.label}"`
            );
        }
        return link;
    }
    __saveIoOrder() {
        const order = {
            input: {
                original: this.__recipe?.input ?? [],
                user: this.__input,
            },
            output: {
                original: this.__recipe?.output ?? [],
                user: this.__output,
            },
        };
        const savedOrder: SerializedOrder = {};
        for (const [key, value] of Object.entries(order)) {
            const hasOriginalOrder = value.original.every((io, index) => value.user[index]?.key === io.key);
            if (!hasOriginalOrder) {
                const originalIndexes = new Map<string, number>(value.original.map((io, index) => [io.name, index]));
                const customOrder = value.user.map((io, index) => {
                    const originalIndex = originalIndexes.get(io.key ?? '');
                    if (originalIndex !== undefined) return originalIndex;
                    return index;
                });
                if (key === 'input') {
                    savedOrder.o1 = customOrder;
                } else {
                    savedOrder.o2 = customOrder;
                }
            }
        }
        return savedOrder;
    }
    __loadIoOrder(savedOrder: SerializedOrder) {
        const order = [
            {
                original: this.__recipe?.input ?? [],
                user: this.__input,
                order: savedOrder.o1,
            },
            {
                original: this.__recipe?.output ?? [],
                user: this.__output,
                order: savedOrder.o2,
            },
        ];
        for (const value of order) {
            if (!value.order) continue;
            const customOrder = new Map<string, number>(
                value.order.map((originalIndex, customIndex) => [value.original[originalIndex]?.key ?? '', customIndex])
            );
            [...value.user].forEach((io) => {
                value.user[customOrder.get(io.key ?? '') ?? 0] = io;
            });
        }
    }
}
