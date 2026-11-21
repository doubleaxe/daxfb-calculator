import type { FlowChartModelBaseImpl } from '../FlowChartModel.js';
import type {
    FactorySnapshotDataBase,
    FlowChartSnapshotDataBase,
    IOLinkSnapshotDataBase,
    RecipeIOSnapshotDataBase,
    RecipeSnapshotDataBase,
} from '../ModelSnapshot.js';
import {
    FactorySnapshotBase,
    FlowChartSnapshotBase,
    IOLinkSnapshotBase,
    RecipeIOSnapshotBase,
    RecipeSnapshotBase,
} from '../ModelSnapshot.js';

export class ModelSnapshotFactoryBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    constructor(flowChart: FlowChartModelBaseImpl) {
        this.__flowChart = flowChart;
    }

    newFlowChartSnapshot(snapshot: FlowChartSnapshotDataBase) {
        return new FlowChartSnapshotBase(this.__flowChart, snapshot);
    }
    newFactorySnapshot(snapshot: FactorySnapshotDataBase) {
        return new FactorySnapshotBase(this.__flowChart, snapshot);
    }
    newRecipeSnapshot(snapshot: RecipeSnapshotDataBase) {
        return new RecipeSnapshotBase(this.__flowChart, snapshot);
    }
    newRecipeIOSnapshot(snapshot: RecipeIOSnapshotDataBase) {
        return new RecipeIOSnapshotBase(this.__flowChart, snapshot);
    }
    newIOLinkSnapshot(snapshot: IOLinkSnapshotDataBase) {
        return new IOLinkSnapshotBase(this.__flowChart, snapshot);
    }
}
