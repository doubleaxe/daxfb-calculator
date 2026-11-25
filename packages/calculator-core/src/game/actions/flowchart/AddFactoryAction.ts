import type { XYPosition } from '#core/game/model/internal/internal.js';
import type { FactorySnapshotBase } from '#core/game/model/ModelSnapshot.js';

import { ActionBase } from '../Action.js';

export class AddFactoryAction extends ActionBase {
    protected readonly __key: string;
    protected readonly __position: XYPosition;
    private __itemIdAdded: string | undefined;
    private __snapshotRedo: FactorySnapshotBase | undefined;

    constructor(key: string, position: XYPosition) {
        super();
        this.__key = key;
        this.__position = position;
    }

    override redo() {
        if (this.__snapshotRedo !== undefined) {
            this.__snapshotRedo.loadFromSnapshot();
            return;
        }
        const factory = this.__flowChartModel?.addItem(this.__key);
        if (!factory) return;
        factory.setPosition(this.__position);
        this.__itemIdAdded = factory.itemId;
    }
    override undo() {
        const factory = this.__flowChartModel?.itemById(this.__itemIdAdded ?? '');
        if (!factory) return;
        this.__snapshotRedo ??= factory.saveToSnapshot();
        factory.deleteItem();
    }
}
