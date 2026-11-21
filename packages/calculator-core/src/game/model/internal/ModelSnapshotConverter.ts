import type { GameDataBase, GameRecipeBase, GameRecipeIOBase } from '#core/game/parser/index.js';
import type { ErrorCollector } from '#core/utils/ErrorCollector.js';

import type {
    FactorySnapshotBase,
    FlowChartSnapshotBase,
    IOLinkSnapshotBase,
    RecipeIOSnapshotBase,
    RecipeSnapshotBase,
} from '../ModelSnapshot.js';
import { normalizeItemPositions, type XYPosition } from './internal.js';
import type { SerializedFactory, SerializedFlowChart, SerializedLink, SerializedOrder } from './ModelSerialized.js';
import type { ModelSnapshotFactoryBase } from './ModelSnapshotFactory.js';

export type IOMap = Map<string, { factory: FactorySnapshotBase; io: RecipeIOSnapshotBase; recipe: RecipeSnapshotBase }>;

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
        const source = ioMap.get(snapshot.sourceIO);
        const target = ioMap.get(snapshot.targetIO);
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
    ): FlowChartSnapshotBase {}
}
