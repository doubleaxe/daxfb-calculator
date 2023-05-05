/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItem, GameRecipe} from '#types/game-data';
import {RecipeIOModelImpl} from './recipe-io';
import type {SavedItem} from './saved-blueprint';
import type {BlueprintItemModel, RecipeIOModel, RecipeModel} from './store';

export class RecipeModelImpl {
    private readonly _recipe;
    private readonly _input: RecipeIOModel[];
    private readonly _output: RecipeIOModel[];
    private readonly _itemsByKey;

    constructor(ownerItem: BlueprintItemModel, recipe: GameRecipe) {
        this._recipe = recipe;
        this._input = recipe.input.map((io) => new RecipeIOModelImpl(io, {ownerItem}));
        this._output = recipe.output.map((io) => new RecipeIOModelImpl(io, {ownerItem}));

        const items = [...this._input, ...this._output];
        this._itemsByKey = new Map(items.map((io) => [io.key, io]));
    }

    _$findSimilarIo(sourceIo: RecipeIOModel, reverce: boolean) {
        const isInput = reverce ? !sourceIo.isInput : sourceIo.isInput;
        const targetArray = isInput ? this._input : this._output;
        return targetArray.find((io) => RecipeModelImpl._$isSimilarIo(sourceIo, io));
    }
    static _$isSimilarIo(sourceIo: RecipeIOModel, targetIo: RecipeIOModel) {
        if(targetIo.isAbstractClassItem && sourceIo.isAbstractClassItem)
            return false;
        return (targetIo.name === sourceIo.name)
        || (
            (targetIo.isAbstractClassItem !== sourceIo.isAbstractClassItem)
            && !targetIo.isMatherialized
            && !sourceIo.isMatherialized
            && (targetIo.type === sourceIo.type)
        );
    }
    _$copySimilarLinksTo(targetRecipe: RecipeModel) {
        for(const targetItem of targetRecipe.items) {
            const similarItem = this._$findSimilarIo(targetItem, false);
            if(!similarItem)
                continue;
            similarItem._$copySimilarLinksTo(targetItem);
        }
    }
    _$deleteAllLinks() {
        for(const item of this.items) {
            item._$deleteAllLinks();
        }
    }
    _$matherializeAllAbstractItems(item: GameItem | undefined) {
        const items = [...this._input, ...this._output];
        if(item) {
            //link is added, materialize all io
            for(const io of items) {
                io._$matherializeAbstractItem(item);
            }
        } else {
            //link is removed, if no links are left - dematerialize all io
            const haveLinks = items.some((io) => io.linksCount);
            if(!haveLinks) {
                for(const io of items) {
                    io._$matherializeAbstractItem(undefined);
                }
            }
        }
    }

    get name() { return this._recipe.name; }
    get input() { return this._input[Symbol.iterator](); }
    get output() { return this._output[Symbol.iterator](); }
    itemByKey(key: string) { return this._itemsByKey.get(key); }
    get items() { return this._itemsByKey.values(); }

    visibleInput() {
        return this._input.filter(item => !item.isHidden);
    }
    invisibleInput() {
        return this._input.filter(item => item.isHidden);
    }
    visibleOutput() {
        return this._output.filter(item => !item.isHidden);
    }
    invisibleOutput() {
        return this._output.filter(item => item.isHidden);
    }

    swapIo(sourceIoKey: string, betweenIndex: [number | undefined, number | undefined]) {
        const sourceIo = this._itemsByKey.get(sourceIoKey);
        if(!sourceIo) {
            return;
        }
        const sourceArray = sourceIo.isInput ? this._input : this._output;
        let inserted = false;
        const newArray = sourceArray.reduce((array, io, index) => {
            if(io.key === sourceIo.key)
                return array;
            if(!inserted) {
                if(((betweenIndex[0] !== undefined) && (index > betweenIndex[0]))
                    || ((betweenIndex[1] !== undefined) && (index === betweenIndex[1]))) {
                    array.push(sourceIo);
                    array.push(io);
                    inserted = true;
                    return array;
                }
                if(index === (sourceArray.length - 1)) {
                    array.push(io);
                    array.push(sourceIo);
                    inserted = true;
                    return array;
                }
            }
            array.push(io);
            return array;
        }, [] as RecipeIOModel[]);

        //apply updates in place
        newArray.forEach((io, index) => { if(sourceArray[index] !== io) sourceArray[index] = io; });
        sourceIo.ownerItem?._$ioSwapped();
    }
    batchSwapIo(visibleKeyOrder: string[]) {
        const orderMap = new Map<string, number>(visibleKeyOrder.map((key, index) => [key, index]));
        for(const array of [this._input, this._output]) {
            //invisible items at the end
            array.sort((a, b) => (orderMap.get(a.key) ?? array.length) - (orderMap.get(b.key) ?? array.length));
        }
    }

    _$saveIoOrder() {
        const order = {
            input: {
                original: this._recipe.input,
                user: this._input,
            },
            output: {
                original: this._recipe.output,
                user: this._output,
            },
        };
        const savedOrder: Partial<SavedItem> = {};
        for(const [key, value] of Object.entries(order)) {
            const hasOriginalOrder = value.original.every((io, index) => (value.user[index].rawName === io.name));
            if(!hasOriginalOrder) {
                const originalIndexes = new Map<string, number>(
                    value.original.map((io, index) => [io.name, index]),
                );
                const customOrder = value.user.map((io, index) => {
                    const originalIndex = originalIndexes.get(io.rawName || '');
                    if(originalIndex !== undefined)
                        return originalIndex;
                    return index;
                });
                if(key == 'input') {
                    savedOrder.o1 = customOrder;
                } else {
                    savedOrder.o2 = customOrder;
                }
            }
        }
        return savedOrder;
    }
    _$loadIoOrder(savedOrder: SavedItem) {
        const order = [{
            original: this._recipe.input,
            user: this._input,
            order: savedOrder.o1,
        }, {
            original: this._recipe.output,
            user: this._output,
            order: savedOrder.o2,
        },
        ];
        for(const value of order) {
            if(!value.order)
                continue;
            const customOrder = new Map<string, number>(
                value.order.map((originalIndex, customIndex) => [value.original[originalIndex]?.name || '', customIndex]),
            );
            [...value.user].forEach((io) => {
                value.user[customOrder.get(io.rawName || '') || 0] = io;
            });
        }
    }
}
