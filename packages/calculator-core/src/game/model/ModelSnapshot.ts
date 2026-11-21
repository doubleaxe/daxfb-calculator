import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import type { XYPosition } from './internal/internal.js';

export class SnapshotBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    constructor(__flowChart: FlowChartModelBaseImpl) {
        this.__flowChart = __flowChart;
    }
}

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
}
