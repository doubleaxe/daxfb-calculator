import type { GameRecipeBase, GameRecipeIOBase } from '../parser/index.js';
import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import { normalizeItemPositions, type XYPosition } from './internal.js';
import type { SerializedFactory, SerializedFlowChart, SerializedLink, SerializedOrder } from './ModelSerialized.js';

export class SnapshotBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    constructor(__flowChart: FlowChartModelBaseImpl) {
        this.__flowChart = __flowChart;
    }
}

export type IOMap = Map<string, { factory: FactorySnapshotBase; io: RecipeIOSnapshotBase; recipe: RecipeSnapshotBase }>;

export type IOLinkSnapshotDataBase = {
    readonly linkId: string;
    readonly sourceIO: string;
    readonly sourceItem: string;
    readonly targetIO: string;
    readonly targetItem: string;
};

export class IOLinkSnapshotBase extends SnapshotBase {
    readonly snapshot: IOLinkSnapshotDataBase;
    constructor(__flowChart: FlowChartModelBaseImpl, snapshot: IOLinkSnapshotDataBase) {
        super(__flowChart);
        this.snapshot = snapshot;
    }

    toSerializedCompactForm(itemIndexes: Map<string, number>, ioMap: IOMap): SerializedLink {
        const source = ioMap.get(this.snapshot.sourceIO);
        const target = ioMap.get(this.snapshot.targetIO);
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

    private __getGameRecipe(
        factory: FactorySnapshotBase,
        recipe: RecipeSnapshotBase | undefined
    ): GameRecipeBase | undefined {
        if (!recipe) return undefined;
        const gameData = this.__flowChart.gameData;
        const item = gameData.getGameItem(factory.snapshot.key);
        return gameData.getItemRecipeDictionary(item).recipesMap.get(recipe.snapshot.key);
    }
}

export type RecipeIOSnapshotDataBase = {
    readonly itemId: string;
    readonly key: string;
    readonly links: IOLinkSnapshotBase[];
};

export class RecipeIOSnapshotBase extends SnapshotBase {
    readonly snapshot: RecipeIOSnapshotDataBase;
    constructor(__flowChart: FlowChartModelBaseImpl, snapshot: RecipeIOSnapshotDataBase) {
        super(__flowChart);
        this.snapshot = snapshot;
    }
}

export type RecipeSnapshotDataBase = {
    readonly input: RecipeIOSnapshotBase[];
    readonly key: string;
    readonly output: RecipeIOSnapshotBase[];
};

export class RecipeSnapshotBase extends SnapshotBase {
    readonly snapshot: RecipeSnapshotDataBase;
    constructor(__flowChart: FlowChartModelBaseImpl, snapshot: RecipeSnapshotDataBase) {
        super(__flowChart);
        this.snapshot = snapshot;
    }

    toSerializedCompactForm(itemKey: string): SerializedOrder {
        const gameData = this.__flowChart.gameData;
        const item = gameData.getGameItem(itemKey);
        const recipe = gameData.getItemRecipeDictionary(item).recipesMap.get(this.snapshot.key);
        const originalInput = recipe?.input ?? [];
        const originalOutput = recipe?.output ?? [];

        const savedOrder: SerializedOrder = {};
        const inputOrder = this.__saveIoOrder(originalInput, this.snapshot.input);
        const outputOrder = this.__saveIoOrder(originalOutput, this.snapshot.output);
        if (inputOrder) savedOrder.o1 = inputOrder;
        if (outputOrder) savedOrder.o2 = outputOrder;
        return savedOrder;
    }

    private __saveIoOrder(original: GameRecipeIOBase[], user: RecipeIOSnapshotBase[]): number[] | undefined {
        const hasOriginalOrder = original.every((io, index) => user[index]?.snapshot.key === io.key);
        if (hasOriginalOrder) return undefined;
        const originalIndexes = new Map<string, number>(original.map((io, index) => [io.key, index]));
        return user.map((io, index) => originalIndexes.get(io.snapshot.key) ?? index);
    }
}

export type FactorySnapshotDataBase = {
    readonly count: number;
    readonly isFlipped: boolean;
    readonly itemId: string;
    readonly key: string;
    readonly locked: boolean;
    readonly position: XYPosition;
    readonly recipe?: RecipeSnapshotBase;
    readonly weight?: number;
};

export class FactorySnapshotBase extends SnapshotBase {
    readonly snapshot: FactorySnapshotDataBase;
    constructor(__flowChart: FlowChartModelBaseImpl, snapshot: FactorySnapshotDataBase) {
        super(__flowChart);
        this.snapshot = snapshot;
    }

    toSerializedCompactForm(offsetBy?: XYPosition): SerializedFactory {
        const position = this.snapshot.position;
        return {
            n: this.snapshot.key,
            p: [Math.round(position.x - (offsetBy?.x ?? 0)), Math.round(position.y - (offsetBy?.y ?? 0))],
            r: this.snapshot.recipe?.snapshot.key ?? '',
            c: this.snapshot.count === 1 ? undefined : this.snapshot.count,
            f: this.snapshot.isFlipped ? 1 : undefined,
            l: this.snapshot.locked ? 1 : undefined,
            w: this.snapshot.weight,
            ...this.snapshot.recipe?.toSerializedCompactForm(this.snapshot.key),
        };
    }
}

export type FlowChartSnapshotDataBase = {
    readonly chartName: string;
    readonly items: FactorySnapshotBase[];
};

export class FlowChartSnapshotBase extends SnapshotBase {
    readonly snapshot: FlowChartSnapshotDataBase;
    constructor(__flowChart: FlowChartModelBaseImpl, snapshot: FlowChartSnapshotDataBase) {
        super(__flowChart);
        this.snapshot = snapshot;
    }

    toSerializedCompactForm(): SerializedFlowChart {
        //normalize positions before saving
        const items = this.snapshot.items;
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

        const description = this.__flowChart.gameData.description;
        return {
            h: {
                g: description.shortName,
                v: description.saveVersion,
            },
            i: items.map((item) => item.toSerializedCompactForm(offsetBy)),
            l: links.map((link) => link.toSerializedCompactForm(itemIndexes, ioMap)),
        };
    }
}
