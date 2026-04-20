import type { GameItemBase } from '../parser/index.js';
import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import { newId } from './internal.js';

export class ItemModelBaseImpl {
    readonly itemId;
    protected readonly __item;
    readonly __flowChart;

    constructor(__flowChart: FlowChartModelBaseImpl, __item?: GameItemBase, itemId?: string) {
        this.__flowChart = __flowChart;
        this.itemId = newId(itemId);
        this.__item = __item;
    }

    get key() {
        return this.__item?.key;
    }
    get name() {
        return this.__item?.name;
    }
    get label() {
        return this.__item?.label;
    }
    get image() {
        return this.__item?.image;
    }
    get type() {
        return this.__item?.type;
    }
}
