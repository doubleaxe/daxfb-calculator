import type { FactoryModelBaseImpl } from './FactoryModel.js';
import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import type { XYPosition } from './internal/internal.js';
import type { RecipeModelBaseImpl } from './RecipeModel.js';

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

    loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        this.__loadFromSnapshot(options);
    }

    protected __loadFromSnapshot(_options?: LoadFromSnapshotOptions) {
        const snapshot = this.snapshot;
        const link = this.flowChart.__createLink0(snapshot, false, this);
        link?.__loadFromSnapshot(this);
        return link;
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

    loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        this.__loadFromSnapshot(options);
    }

    protected __loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        const stage = options?.stage;
        const snapshot = this.snapshot;
        const io = this.flowChart.__findIo(snapshot.factoryItemId, snapshot.itemId);
        if (!io) return undefined;
        if (stage === undefined || stage === LoadFromSnapshotStage.LINK) {
            io.__deleteAllLinks();
            io.__loadFromSnapshot(this);
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

    loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        this.__loadFromSnapshot(options);
    }

    protected __loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        const stage = options?.stage;
        const snapshot = this.snapshot;
        const item = this.flowChart.__itemById(snapshot.factoryItemId);
        if (!item) return undefined;

        let recipe: RecipeModelBaseImpl | undefined;
        if (stage === undefined || stage === LoadFromSnapshotStage.FACTORY) {
            recipe = item.__selectRecipe(snapshot.key, this);
            recipe?.__loadFromSnapshot(this);
        }
        if (stage === undefined || stage === LoadFromSnapshotStage.LINK) {
            snapshot.input.forEach((input) => input.loadFromSnapshot(options));
            // if we are loading links globally, we only have to load one type, because they always have two sides
            if (stage === undefined) {
                snapshot.output.forEach((output) => output.loadFromSnapshot(options));
            }
        }

        recipe ??= item.__selectedRecipeInternal;
        return recipe;
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

    loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        this.__loadFromSnapshot(options);
    }

    protected __loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        const stage = options?.stage;
        const snapshot = this.snapshot;

        let item: FactoryModelBaseImpl | undefined;
        if (stage === undefined || stage === LoadFromSnapshotStage.FACTORY) {
            const item0 = this.flowChart.__addItem(snapshot.key, this);
            item0.__loadFromSnapshot(this);
            item = item0;
        }
        snapshot.recipe?.loadFromSnapshot(options);

        item ??= this.flowChart.__itemById(snapshot.itemId);
        return item;
    }
}

export type FlowChartSnapshotDataBase = {
    readonly chartName: string;
    readonly items: FactorySnapshotBase[];
    readonly nextId: number;
};

export class FlowChartSnapshotBase extends SnapshotBase {
    readonly snapshot: FlowChartSnapshotDataBase;
    constructor(flowChart: FlowChartModelBaseImpl, snapshot: FlowChartSnapshotDataBase) {
        super(flowChart);
        this.snapshot = snapshot;
    }

    loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        this.__loadFromSnapshot(options);
    }

    protected __loadFromSnapshot(options?: LoadFromSnapshotOptions) {
        const snapshot = this.snapshot;
        this.flowChart.__loadFromSnapshot(this);

        // items, then links
        snapshot.items.forEach((item) =>
            item.loadFromSnapshot({
                ...options,
                stage: LoadFromSnapshotStage.FACTORY,
            })
        );

        snapshot.items.forEach((item) =>
            item.loadFromSnapshot({
                ...options,
                stage: LoadFromSnapshotStage.LINK,
            })
        );
    }
}
