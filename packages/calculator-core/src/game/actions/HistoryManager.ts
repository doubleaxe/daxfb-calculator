import type { FlowChartModelBase } from '../model/index.js';
import type { ActionBase } from './Action.js';

export class HistoryManagerImpl {
    private readonly __flowChartModel: FlowChartModelBase;
    private __undoStack: ActionBase[] = [];
    private __redoStack: ActionBase[] = [];

    constructor(flowChartModel: FlowChartModelBase) {
        this.__flowChartModel = flowChartModel;
    }

    get canUndo() {
        return this.__undoStack.length > 0;
    }
    get canRedo() {
        return this.__redoStack.length > 0;
    }

    execute(action: ActionBase) {
        action.init(this.__flowChartModel);
        action.redo();
        this.__undoStack.push(action);
        this.__redoStack = [];
    }

    undo() {
        const action = this.__undoStack.pop();
        if (!action) return;
        action.undo();
        this.__redoStack.push(action);
    }

    redo() {
        const action = this.__redoStack.pop();
        if (!action) return;
        action.redo();
        this.__undoStack.push(action);
    }

    clear() {
        this.__undoStack = [];
        this.__redoStack = [];
    }
}
