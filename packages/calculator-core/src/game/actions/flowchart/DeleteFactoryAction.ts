import type { FactoryModelBaseImpl } from '@daxfb/core/game/model/FactoryModel.js';
import type { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import type { IOLinkModelBaseImpl } from '@daxfb/core/game/model/IOLinkModel.js';
import type { FactoryModelBase, FlowChartModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class DeleteFactoryAction extends ActionBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    protected readonly __item: FactoryModelBaseImpl;
    protected __links: IOLinkModelBaseImpl[] | undefined;

    constructor(flowChart: FlowChartModelBase, item: FactoryModelBase) {
        super();
        this.__flowChart = flowChart as unknown as FlowChartModelBaseImpl;
        this.__item = item as unknown as FactoryModelBaseImpl;
    }

    execute() {
        this.__links ??= this.__item.__getAllLinks();
        this.__item.__deleteItem();
    }

    undo() {
        this.__flowChart.__insertItem(this.__item);
        for (const link of this.__links ?? []) {
            this.__flowChart.__insertLink(link);
        }
    }
}
