import { ActionBase } from '../Action.js';

export class SetChartNameAction extends ActionBase {
    private readonly __name: string;
    private __nameOld: string | undefined;

    constructor(name: string) {
        super();
        this.__name = name;
    }

    override redo() {
        const flowChart = this.__flowChartModel;
        if (!flowChart) return;
        this.__nameOld ??= flowChart.chartName;
        flowChart.setChartName(this.__name);
    }
    override undo() {
        const flowChart = this.__flowChartModel;
        const nameOld = this.__nameOld;
        if (!flowChart || nameOld === undefined) return;
        flowChart.setChartName(nameOld);
    }
}
