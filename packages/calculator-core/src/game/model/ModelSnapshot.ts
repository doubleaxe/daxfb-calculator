import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import type { XYPosition } from './internal/internal.js';
import type { FactoryModelBase, IOLinkModelBase, RecipeIOModelBase, RecipeModelBase } from './types.js';

export const LoadFromSnapshotStage = {
    FACTORY: 1,
    LINK: 2,
} as const;

export type LoadFromSnapshotOptions = {
    stage?: number;
};

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

    loadFromSnapshot(_options?: LoadFromSnapshotOptions): IOLinkModelBase | undefined {
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

    loadFromSnapshot(options?: LoadFromSnapshotOptions): RecipeIOModelBase | undefined {
        const stage = options?.stage;
        const snapshot = this.snapshot;
        const io = this.flowChart.__findIo(snapshot.factoryItemId, snapshot.itemId);
        if (!io) return undefined;
        if (stage === undefined || stage === LoadFromSnapshotStage.LINK) {
            io.__deleteAllLinks();
            snapshot.links.forEach((l) => l.loadFromSnapshot(options));
        }
        return io;
    }
}

export type RecipeSnapshotDataBase = {
    readonly factoryItemId: string;
    readonly input: RecipeIOSnapshotBase[];
    readonly key: string;
    readonly output: RecipeIOSnapshotBase[];
};

type IOSnapshot = { index: number; snapshot: RecipeIOSnapshotBase };

export class RecipeSnapshotBase extends SnapshotBase {
    readonly snapshot: RecipeSnapshotDataBase;
    private __inputMap: Map<string, IOSnapshot> | undefined;
    private __outputMap: Map<string, IOSnapshot> | undefined;
    constructor(flowChart: FlowChartModelBaseImpl, snapshot: RecipeSnapshotDataBase) {
        super(flowChart);
        this.snapshot = snapshot;
    }

    loadFromSnapshot(options?: LoadFromSnapshotOptions): RecipeModelBase | undefined {
        const stage = options?.stage;
        const snapshot = this.snapshot;
        const item = this.flowChart.__itemById(snapshot.factoryItemId);
        if (!item) return undefined;
        if (stage === undefined || stage === LoadFromSnapshotStage.FACTORY) {
            item.__selectRecipe(snapshot.key, this);
        }
        if (stage === undefined || stage === LoadFromSnapshotStage.LINK) {
            snapshot.input.forEach((input) => input.loadFromSnapshot(options));
            // if we are loading links globally, we only have to load one type, because they always have two sides
            if (stage === undefined) {
                snapshot.output.forEach((output) => output.loadFromSnapshot(options));
            }
        }
        return item.selectedRecipe;
    }

    get inputMap() {
        let __inputMap = this.__inputMap;
        if (!__inputMap) {
            const snapshot = this.snapshot;
            __inputMap = new Map<string, IOSnapshot>(
                (snapshot.input ?? []).map((i, index) => [i.snapshot.key, { snapshot: i, index }])
            );
            this.__inputMap = __inputMap;
        }
        return __inputMap;
    }

    get outputMap() {
        let __outputMap = this.__outputMap;
        if (!__outputMap) {
            const snapshot = this.snapshot;
            __outputMap = new Map<string, IOSnapshot>(
                (snapshot.output ?? []).map((i, index) => [i.snapshot.key, { snapshot: i, index }])
            );
            this.__outputMap = __outputMap;
        }
        return __outputMap;
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

    loadFromSnapshot(options?: LoadFromSnapshotOptions): FactoryModelBase | undefined {
        const stage = options?.stage;
        const snapshot = this.snapshot;
        let item: FactoryModelBase | undefined;
        if (stage === undefined || stage === LoadFromSnapshotStage.FACTORY) {
            item = this.flowChart.__addItem(snapshot.key, this);
        }
        if (stage === undefined || stage === LoadFromSnapshotStage.LINK) {
            snapshot.recipe?.loadFromSnapshot(options);
        }
        item ??= this.flowChart.itemById(snapshot.itemId);
        return item;
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
