import { ActionBase } from '../Action.js';

export abstract class FactoryActionBase extends ActionBase {
    // do not store factory itself
    // between undo-redo it can be deleted and recreated from snapshot
    // id will be the same, but object will be different
    protected readonly __itemId: string;

    constructor(itemId: string) {
        super();
        this.__itemId = itemId;
    }

    protected get __factory() {
        return this.__flowChartModel?.itemById(this.__itemId);
    }
}
