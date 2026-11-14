import type { FactoryModelBaseImpl } from '@daxfb/core/game/model/FactoryModel.js';
import type { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import type { IOLinkModelBaseImpl } from '@daxfb/core/game/model/IOLinkModel.js';
import type { FactoryModelBase, FlowChartModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class UpgradeFactoryAction extends ActionBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    protected readonly __oldItem: FactoryModelBaseImpl;
    protected readonly __direction: -1 | 1;
    protected __newItem: FactoryModelBaseImpl | undefined;
    protected __oldLinks: IOLinkModelBaseImpl[] = [];
    protected __newLinks: IOLinkModelBaseImpl[] = [];
    protected __executed = false;

    constructor(flowChart: FlowChartModelBase, item: FactoryModelBase, direction: -1 | 1) {
        super();
        this.__flowChart = flowChart as unknown as FlowChartModelBaseImpl;
        this.__oldItem = item as unknown as FactoryModelBaseImpl;
        this.__direction = direction;
    }

    execute() {
        if (!this.__executed) {
            this.__executed = true;
            this.__oldLinks = this.__oldItem.__getAllLinks();
            this.__newItem = this.__oldItem.__upgrade(this.__direction);
            if (!this.__newItem) return;
            this.__newLinks = this.__newItem.__getAllLinks();
            return;
        }

        if (!this.__newItem) return;
        for (const link of this.__oldLinks) {
            this.__flowChart.__deleteLink(link);
        }
        this.__flowChart.__deleteItem(this.__oldItem);
        this.__flowChart.__insertItem(this.__newItem);
        for (const link of this.__newLinks) {
            this.__flowChart.__insertLink(link);
        }
    }

    undo() {
        if (!this.__newItem) return;
        for (const link of this.__newLinks) {
            this.__flowChart.__deleteLink(link);
        }
        this.__flowChart.__deleteItem(this.__newItem);
        this.__flowChart.__insertItem(this.__oldItem);
        for (const link of this.__oldLinks) {
            this.__flowChart.__insertLink(link);
        }
    }
}
