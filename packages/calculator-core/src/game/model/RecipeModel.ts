import type { GameRecipeIOBase } from '../parser/index.js';
import type { FactoryModelBaseImpl } from './FactoryModel.js';
import type { RecipeSnapshotBase } from './ModelSnapshot.js';
import type { CreateRecipeIOModel, RecipeIOModelBaseImpl } from './RecipeIOModel.js';
import type { RecipeIOModelBase } from './types.js';

export type CreateRecipeModel<
    FACT extends FactoryModelBaseImpl = FactoryModelBaseImpl,
    SNAP extends RecipeSnapshotBase = RecipeSnapshotBase,
    REC extends RecipeModelBaseImpl = RecipeModelBaseImpl,
> = (__factory: FACT, key: string, snapshot: SNAP | undefined) => REC;

export abstract class RecipeModelBaseImpl {
    readonly __factory;
    protected readonly __recipe;
    protected readonly __input: RecipeIOModelBaseImpl[];
    protected readonly __output: RecipeIOModelBaseImpl[];
    protected readonly __itemsArray;
    protected readonly __itemsById;
    protected readonly __itemsByKey;

    protected readonly __ioConstructor: CreateRecipeIOModel;

    constructor(
        __factory: FactoryModelBaseImpl,
        key: string,
        snapshot: RecipeSnapshotBase | undefined,
        __ioConstructor: CreateRecipeIOModel
    ) {
        this.__ioConstructor = __ioConstructor;
        this.__factory = __factory;
        const recipe = __factory.__getRecipe(key);
        this.__recipe = recipe;

        const snapshotInputMap = snapshot?.inputMap;
        const snapshotOutputMap = snapshot?.outputMap;

        this.__input =
            recipe?.input.map((io: GameRecipeIOBase) =>
                __ioConstructor(this, io, snapshotInputMap?.get(io.key)?.snapshot)
            ) ?? [];
        this.__output =
            recipe?.output.map((io: GameRecipeIOBase) =>
                __ioConstructor(this, io, snapshotOutputMap?.get(io.key)?.snapshot)
            ) ?? [];

        if (snapshotInputMap && snapshotOutputMap) {
            this.__input.sort(
                (io1, io2) =>
                    (snapshotInputMap.get(io1.key ?? '')?.index ?? 0) -
                    (snapshotInputMap.get(io2.key ?? '')?.index ?? 0)
            );
            this.__output.sort(
                (io1, io2) =>
                    (snapshotOutputMap.get(io1.key ?? '')?.index ?? 0) -
                    (snapshotOutputMap.get(io2.key ?? '')?.index ?? 0)
            );
        }

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

    saveToSnapshot() {
        const snapshot = this.__factory.__flowChart.__snapshotFactory.newRecipeSnapshot({
            factoryItemId: this.__factory.itemId,
            input: this.__input.map((io) => io.saveToSnapshot()),
            key: this.key ?? '',
            output: this.__output.map((io) => io.saveToSnapshot()),
        });
        return snapshot;
    }
    __loadFromSnapshot(_snapshot: RecipeSnapshotBase) {
        this.__factory.__flowChart.__requestSolveGraph([this.__factory]);
    }
}
