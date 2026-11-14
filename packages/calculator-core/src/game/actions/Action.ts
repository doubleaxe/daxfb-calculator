import type { FlowChartModelBase } from '../model/index.js';

export type FlowChartAction = {
    after?: () => void;
    before?: () => void;
    redo: () => void;
    undo: () => void;
};

export abstract class ActionBase {
    protected __action: FlowChartAction | undefined;
    abstract init(flowChartModel: FlowChartModelBase): void;
    redo(): void {
        if (!this.__action) return;
        this.__action.before?.();
        this.__action.redo();
        this.__action.after?.();
    }
    undo(): void {
        if (!this.__action) return;
        this.__action.before?.();
        this.__action.undo();
        this.__action.after?.();
    }
}
