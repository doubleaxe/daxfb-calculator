import type { GameDataBase, GameRecipeBase, GameRecipeIOBase } from '#core/game/parser/index.js';
import type { ErrorCollector } from '#core/utils/ErrorCollector.js';

import type {
    FactorySnapshotBase,
    FlowChartSnapshotBase,
    IOLinkSnapshotBase,
    RecipeIOSnapshotBase,
    RecipeSnapshotBase,
} from '../ModelSnapshot.js';
import { newId, normalizeItemPositions, type XYPosition } from './internal.js';
import type { SerializedFactory, SerializedFlowChart, SerializedLink, SerializedOrder } from './ModelSerialized.js';
import type { ModelSnapshotFactoryBase } from './ModelSnapshotFactory.js';

type IOMap = Map<string, { factory: FactorySnapshotBase; io: RecipeIOSnapshotBase; recipe: RecipeSnapshotBase }>;

type ConvertedRecipe = {
    input: RecipeIOSnapshotBase[];
    output: RecipeIOSnapshotBase[];
    recipe?: RecipeSnapshotBase;
};

type SerializedFactoryEntry = {
    factory: FactorySnapshotBase;
    label: string;
    recipe: ConvertedRecipe;
};

export class ModelSnapshotToSerializedCompactFormBase {
    protected readonly gameData: GameDataBase;
    constructor(gameData: GameDataBase) {
        this.gameData = gameData;
    }

    toSerializedCompactForm(flowChartSnapshot: FlowChartSnapshotBase): SerializedFlowChart {
        //normalize positions before saving
        const items = flowChartSnapshot.snapshot.items;
        const itemIndexes = new Map(items.map((item, index) => [item.snapshot.itemId, index]));
        const { minItemXY: offsetBy } = normalizeItemPositions(items.map(({ snapshot }) => snapshot));

        const ioMap = new Map<
            string,
            { factory: FactorySnapshotBase; io: RecipeIOSnapshotBase; recipe: RecipeSnapshotBase }
        >();
        for (const factory of items) {
            const recipe = factory.snapshot.recipe;
            if (!recipe) continue;
            for (const io of [...recipe.snapshot.input, ...recipe.snapshot.output]) {
                ioMap.set(io.snapshot.itemId, { factory, io, recipe });
            }
        }

        const links: IOLinkSnapshotBase[] = [];
        for (const io of ioMap.values()) {
            for (const link of io.io.snapshot.links) {
                links.push(link);
            }
        }

        const description = this.gameData.description;
        return {
            h: {
                g: description.shortName,
                v: description.saveVersion,
            },
            i: items.map((item) => this.factoryToSerializedCompactForm(item, offsetBy)),
            l: links.map((link) => this.ioLinkToSerializedCompactForm(link, itemIndexes, ioMap)),
        };
    }

    protected factoryToSerializedCompactForm(
        factorySnapshot: FactorySnapshotBase,
        offsetBy?: XYPosition
    ): SerializedFactory {
        const snapshot = factorySnapshot.snapshot;
        const position = snapshot.position;
        return {
            n: snapshot.key,
            p: [Math.round(position.x - (offsetBy?.x ?? 0)), Math.round(position.y - (offsetBy?.y ?? 0))],
            r: snapshot.recipe?.snapshot.key ?? '',
            c: snapshot.count === 1 ? undefined : snapshot.count,
            f: snapshot.isFlipped ? 1 : undefined,
            l: snapshot.locked ? 1 : undefined,
            w: snapshot.weight,
            ...this.recipeToSerializedCompactForm(snapshot.recipe, snapshot.key),
        };
    }

    protected recipeToSerializedCompactForm(
        recipeSnapshot: RecipeSnapshotBase | undefined,
        itemKey: string
    ): SerializedOrder {
        if (!recipeSnapshot) return {};
        const snapshot = recipeSnapshot.snapshot;
        const gameData = this.gameData;
        const item = gameData.getGameItem(itemKey);
        const recipe = gameData.getItemRecipeDictionary(item).recipesMap.get(snapshot.key);
        const originalInput = recipe?.input ?? [];
        const originalOutput = recipe?.output ?? [];

        const savedOrder: SerializedOrder = {};
        const inputOrder = this.__saveIoOrder(originalInput, snapshot.input);
        const outputOrder = this.__saveIoOrder(originalOutput, snapshot.output);
        if (inputOrder) savedOrder.o1 = inputOrder;
        if (outputOrder) savedOrder.o2 = outputOrder;
        return savedOrder;
    }

    protected __saveIoOrder(original: GameRecipeIOBase[], user: RecipeIOSnapshotBase[]): number[] | undefined {
        const hasOriginalOrder = original.every((io, index) => user[index]?.snapshot.key === io.key);
        if (hasOriginalOrder) return undefined;
        const originalIndexes = new Map<string, number>(original.map((io, index) => [io.key, index]));
        return user.map((io, index) => originalIndexes.get(io.snapshot.key) ?? index);
    }

    protected ioLinkToSerializedCompactForm(
        ioLinkSnapshot: IOLinkSnapshotBase,
        itemIndexes: Map<string, number>,
        ioMap: IOMap
    ): SerializedLink {
        const snapshot = ioLinkSnapshot.snapshot;
        const source = ioMap.get(snapshot.sourceIOId);
        const target = ioMap.get(snapshot.targetIOId);
        const sourceRecipe = source ? this.__getGameRecipe(source.factory, source.recipe) : undefined;
        const targetRecipe = target ? this.__getGameRecipe(target.factory, target.recipe) : undefined;
        const inputIndex = itemIndexes.get(target?.factory.snapshot.key ?? '') ?? 0;
        const outputIndex = itemIndexes.get(source?.factory.snapshot.key ?? '') ?? 0;
        //if we can link by multiple paths for same item - then link is ambiguous
        //we should store name as well in this case
        let isAmbiguous = false;
        if (sourceRecipe && targetRecipe) {
            const inputKeys = new Set(targetRecipe.input.map((io) => io.key));
            const similarIo = sourceRecipe.output.reduce((sum, i) => {
                if (inputKeys.has(i.key ?? '')) sum++;
                return sum;
            }, 0);
            isAmbiguous = similarIo > 1;
        }
        return {
            l: [inputIndex, outputIndex],
            n: isAmbiguous ? target?.io.snapshot.key : undefined,
        };
    }

    protected __getGameRecipe(
        factory: FactorySnapshotBase,
        recipe: RecipeSnapshotBase | undefined
    ): GameRecipeBase | undefined {
        if (!recipe) return undefined;
        const gameData = this.gameData;
        const item = gameData.getGameItem(factory.snapshot.key);
        return gameData.getItemRecipeDictionary(item).recipesMap.get(recipe.snapshot.key);
    }
}

export class ModelSnapshotFromSerializedCompactFormBase {
    protected readonly gameData: GameDataBase;
    protected readonly snapshotFactory: ModelSnapshotFactoryBase;
    constructor(gameData: GameDataBase, snapshotFactory: ModelSnapshotFactoryBase) {
        this.gameData = gameData;
        this.snapshotFactory = snapshotFactory;
    }

    fromSerializedCompactForm(
        serializedFlowChart: SerializedFlowChart,
        errorCollector: ErrorCollector
    ): FlowChartSnapshotBase {
        const { compatibleSaveVersions: compatVersions } = this.gameData.description;
        if (serializedFlowChart.h?.v && !compatVersions.some((v) => v === serializedFlowChart.h?.v)) {
            errorCollector.collectError(
                `Incompatible game version, expecting "${compatVersions.join(',')}", got "${serializedFlowChart.h?.v}"`
            );
        }

        const items: FactorySnapshotBase[] = [];
        const factoryEntries = new Map<number, SerializedFactoryEntry>();
        serializedFlowChart.i.forEach((i, index) => {
            const entry = this.factoryFromSerializedCompactForm(i, errorCollector);
            if (!entry) return;
            items.push(entry.factory);
            factoryEntries.set(index, entry);
        });

        const usedPairs = new Set<string>();
        serializedFlowChart.l.forEach((link) => {
            this.ioLinkFromSerializedCompactForm(link, factoryEntries, usedPairs, errorCollector);
        });

        return this.snapshotFactory.newFlowChartSnapshot({
            chartName: `${this.gameData.description.description} New Flow Chart`,
            items,
        });
    }

    protected factoryFromSerializedCompactForm(
        factory: SerializedFactory,
        errorCollector: ErrorCollector
    ): SerializedFactoryEntry | undefined {
        const item = this.gameData.getGameItem(factory.n);
        if (!item?.name) {
            //invalid item, old/broken recipe
            errorCollector.collectError(`Invalid item id "${factory.n}"`);
            return undefined;
        }
        const factoryItemId = newId();
        const recipe = this.recipeFromSerializedCompactForm(factory, factoryItemId, errorCollector);
        const factorySnapshot = this.snapshotFactory.newFactorySnapshot({
            count: factory.c ?? 1,
            isFlipped: !!factory.f,
            itemId: factoryItemId,
            key: factory.n,
            locked: !!factory.l,
            position: {
                x: factory.p[0] ?? 0,
                y: factory.p[1] ?? 0,
            },
            recipe: recipe.recipe,
            weight: factory.w,
        });
        return { factory: factorySnapshot, label: item.label, recipe };
    }

    protected recipeFromSerializedCompactForm(
        factory: SerializedFactory,
        factoryItemId: string,
        errorCollector: ErrorCollector
    ): ConvertedRecipe {
        const empty: ConvertedRecipe = { input: [], output: [] };
        if (!factory.r) return empty;

        const itemKey = factory.n;
        const item = this.gameData.getGameItem(itemKey);
        const recipe = this.gameData.getItemRecipeDictionary(item).recipesMap.get(factory.r);
        if (!recipe) {
            errorCollector.collectError(`Cannot select recipe ${factory.r} for item ${item?.label ?? itemKey}`);
            return empty;
        }

        const input = this.__applyIoOrder(recipe.input, factory.o1).map((io) =>
            this.snapshotFactory.newRecipeIOSnapshot({
                itemId: newId(),
                factoryItemId,
                key: io.key,
                links: [],
            })
        );
        const output = this.__applyIoOrder(recipe.output, factory.o2).map((io) =>
            this.snapshotFactory.newRecipeIOSnapshot({
                itemId: newId(),
                factoryItemId,
                key: io.key,
                links: [],
            })
        );
        const recipeSnapshot = this.snapshotFactory.newRecipeSnapshot({
            factoryItemId,
            input,
            key: recipe.key,
            output,
        });
        return { recipe: recipeSnapshot, input, output };
    }

    protected ioLinkFromSerializedCompactForm(
        link: SerializedLink,
        factoryEntries: Map<number, SerializedFactoryEntry>,
        usedPairs: Set<string>,
        errorCollector: ErrorCollector
    ): IOLinkSnapshotBase | undefined {
        //first array item is always input, second is always output
        //the order is important, because we may connect for example generator to electric engine
        //in this case we may connect by either end
        //generator output to electric engine
        //or electric engine output to generator
        //which end is connected is determined by io order
        const inputEntry = factoryEntries.get(link.l[0] ?? -1);
        const outputEntry = factoryEntries.get(link.l[1] ?? -1);
        if (!inputEntry || !outputEntry) {
            //broken link
            errorCollector.collectError(`Invalid link "${link.l[0]}" => "${link.l[1]}"`);
            return undefined;
        }
        //if we can link by multiple paths for same item - then link is ambiguous
        //we should restore saved name
        const inputIos = link.n
            ? inputEntry.recipe.input.filter((io) => io.snapshot.key === link.n)
            : inputEntry.recipe.input;
        const outputIos = link.n
            ? outputEntry.recipe.output.filter((io) => io.snapshot.key === link.n)
            : outputEntry.recipe.output;

        for (const inputIo of inputIos) {
            const outputIo = outputIos.find((io) => {
                if (io.snapshot.key !== inputIo.snapshot.key) return false;
                return !usedPairs.has(`${inputIo.snapshot.itemId}|${io.snapshot.itemId}`);
            });
            if (!outputIo) continue;

            usedPairs.add(`${inputIo.snapshot.itemId}|${outputIo.snapshot.itemId}`);
            const loadedLink = this.snapshotFactory.newIOLinkSnapshot({
                linkId: newId(),
                sourceIOId: outputIo.snapshot.itemId,
                sourceId: outputEntry.factory.snapshot.itemId,
                targetIOId: inputIo.snapshot.itemId,
                targetId: inputEntry.factory.snapshot.itemId,
            });
            inputIo.snapshot.links.push(loadedLink);
            outputIo.snapshot.links.push(loadedLink);
            return loadedLink;
        }
        errorCollector.collectError(`Cannot load link "${outputEntry.label}" => "${inputEntry.label}"`);
        return undefined;
    }

    protected __applyIoOrder(original: GameRecipeIOBase[], order?: number[]): GameRecipeIOBase[] {
        if (!order) return [...original];
        const result = [...original];
        order.forEach((originalIndex, customIndex) => {
            const io = original[originalIndex];
            if (io) result[customIndex] = io;
        });
        return result;
    }
}
