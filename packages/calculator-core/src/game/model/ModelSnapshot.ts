import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import type { XYPosition } from './internal/internal.js';
import type { IOLinkModelBase, RecipeIOModelBase, RecipeModelBase } from './types.js';

export class SnapshotBase {
    protected readonly flowChart: FlowChartModelBaseImpl;
    constructor(flowChart: FlowChartModelBaseImpl) {
        this.flowChart = flowChart;
    }
}

export type IOLinkSnapshotDataBase = {
    readonly linkId: string;
    readonly sourceId: string;
    readonly sourceIOId: string;
    readonly targetId: string;
    readonly targetIOId: string;
};

export class IOLinkSnapshotBase extends SnapshotBase {
    readonly snapshot: IOLinkSnapshotDataBase;
    constructor(flowChart: FlowChartModelBaseImpl, snapshot: IOLinkSnapshotDataBase) {
        super(flowChart);
        this.snapshot = snapshot;
    }

    loadFromSnapshot(): IOLinkModelBase | undefined {
        const snapshot = this.snapshot;
        return this.flowChart.__createLink0(snapshot, false, this);
    }
}

export type RecipeIOSnapshotDataBase = {
    readonly factoryItemId: string;
    readonly itemId: string;
    readonly key: string;
    readonly links: IOLinkSnapshotBase[];
};

export class RecipeIOSnapshotBase extends SnapshotBase {
    readonly snapshot: RecipeIOSnapshotDataBase;
    constructor(flowChart: FlowChartModelBaseImpl, snapshot: RecipeIOSnapshotDataBase) {
        super(flowChart);
        this.snapshot = snapshot;
    }

    loadFromSnapshot(): RecipeIOModelBase | undefined {
        const snapshot = this.snapshot;
        const io = this.flowChart.__findIo(snapshot.factoryItemId, snapshot.itemId);
        if (!io) return undefined;
        io.__deleteAllLinks();
        snapshot.links.forEach((l) => l.loadFromSnapshot());
        return io;
    }
}

export type RecipeSnapshotDataBase = {
    readonly factoryItemId: string;
    readonly input: RecipeIOSnapshotBase[];
    readonly key: string;
    readonly output: RecipeIOSnapshotBase[];
};

export class RecipeSnapshotBase extends SnapshotBase {
    readonly snapshot: RecipeSnapshotDataBase;
    constructor(flowChart: FlowChartModelBaseImpl, snapshot: RecipeSnapshotDataBase) {
        super(flowChart);
        this.snapshot = snapshot;
    }

    loadFromSnapshot(): RecipeModelBase | undefined {
        const snapshot = this.snapshot;
        const item = this.flowChart.__itemById(snapshot.factoryItemId);
        if (!item) return undefined;
        item.__selectRecipe(snapshot.key, this);
        return item.selectedRecipe;
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
    constructor(flowChart: FlowChartModelBaseImpl, snapshot: FactorySnapshotDataBase) {
        super(flowChart);
        this.snapshot = snapshot;
    }
}

export type FlowChartSnapshotDataBase = {
    readonly chartName: string;
    readonly items: FactorySnapshotBase[];
};

export class FlowChartSnapshotBase extends SnapshotBase {
    readonly snapshot: FlowChartSnapshotDataBase;
    constructor(flowChart: FlowChartModelBaseImpl, snapshot: FlowChartSnapshotDataBase) {
        super(flowChart);
        this.snapshot = snapshot;
    }
}
