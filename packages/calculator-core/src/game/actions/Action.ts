import type { FlowChartModelBase } from '../model/index.js';

export abstract class ActionBase {
    protected __flowChartModel: FlowChartModelBase | undefined;
    init(flowChartModel: FlowChartModelBase) {
        this.__flowChartModel = flowChartModel;
    }

    abstract redo(): void;
    abstract undo(): void;
}
