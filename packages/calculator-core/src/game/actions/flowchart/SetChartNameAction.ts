import type { FlowChartModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class SetChartNameAction extends ActionBase {
    private readonly __flowChart: FlowChartModelBase;
    private readonly __name: string;

    constructor(flowChart: FlowChartModelBase, name: string) {
        super();
        this.__flowChart = flowChart;
        this.__name = name;
    }

    override init(): void {
        this.__action = this.__flowChart.setChartName(this.__name);
    }
}
