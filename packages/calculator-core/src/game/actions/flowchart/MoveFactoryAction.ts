import type { FactoryModelBaseImpl, XYPosition } from '@daxfb/core/game/model/FactoryModel.js';
import type { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import type { FactoryModelBase, FlowChartModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class MoveFactoryAction extends ActionBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    protected readonly __item: FactoryModelBaseImpl;
    protected readonly __position: XYPosition;
    protected __oldPosition: undefined | XYPosition;

    constructor(flowChart: FlowChartModelBase, item: FactoryModelBase, position: XYPosition) {
        super();
        this.__flowChart = flowChart as unknown as FlowChartModelBaseImpl;
        this.__item = item as unknown as FactoryModelBaseImpl;
        this.__position = position;
    }

    execute() {
        this.__oldPosition ??= { ...this.__item.position };
        this.__item.__setPosition({ ...this.__position });
        this.__flowChart.__touchItems();
    }

    undo() {
        if (!this.__oldPosition) return;
        this.__item.__setPosition({ ...this.__oldPosition });
        this.__flowChart.__touchItems();
    }
}
