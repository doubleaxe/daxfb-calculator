import type { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import type { IOLinkModelBaseImpl } from '@daxfb/core/game/model/IOLinkModel.js';
import type { FlowChartModelBase, IOLinkModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class DeleteLinkAction extends ActionBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    protected readonly __link: IOLinkModelBaseImpl;

    constructor(flowChart: FlowChartModelBase, link: IOLinkModelBase) {
        super();
        this.__flowChart = flowChart as unknown as FlowChartModelBaseImpl;
        this.__link = link as unknown as IOLinkModelBaseImpl;
    }

    execute() {
        this.__flowChart.__deleteLink(this.__link);
    }

    undo() {
        this.__flowChart.__insertLink(this.__link);
    }
}
