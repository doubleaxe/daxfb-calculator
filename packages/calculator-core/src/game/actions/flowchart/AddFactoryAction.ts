import type { FactoryModelBaseImpl, XYPosition } from '@daxfb/core/game/model/FactoryModel.js';
import type { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import type { FlowChartModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class AddFactoryAction extends ActionBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    protected readonly __key: string;
    protected readonly __position: XYPosition;
    protected __item: FactoryModelBaseImpl | undefined;

    constructor(flowChart: FlowChartModelBase, key: string, position: XYPosition) {
        super();
        this.__flowChart = flowChart as unknown as FlowChartModelBaseImpl;
        this.__key = key;
        this.__position = position;
    }

    get item() {
        return this.__item;
    }

    execute() {
        if (this.__item) {
            this.__flowChart.__insertItem(this.__item);
            return;
        }

        const item = this.__flowChart.__addItem(this.__key);
        if (!item.key) return;
        item.__setPosition(this.__position);
        this.__item = item;
    }

    undo() {
        if (!this.__item) return;
        this.__flowChart.__deleteItem(this.__item);
    }
}
