import type { FactorySnapshotBase } from '#core/game/model/ModelSnapshot.js';

import { FactoryActionBase } from './FactoryActionBase.js';

export class UpgradeFactoryAction extends FactoryActionBase {
    private readonly __direction: -1 | 1;
    private __itemIdUpgraded: string | undefined;
    private __snapshot: FactorySnapshotBase | undefined;
    private __snapshotRedo: FactorySnapshotBase | undefined;

    constructor(itemId: string, direction: -1 | 1) {
        super(itemId);
        this.__direction = direction;
    }

    override redo() {
        if (this.__snapshotRedo !== undefined) {
            this.__snapshotRedo.loadFromSnapshot();
            return;
        }
        const originalFactory = this.__factory;
        if (!originalFactory) return;
        this.__snapshot ??= originalFactory.saveToSnapshot();
        const upgradedFactory = originalFactory.upgrade(this.__direction);
        this.__itemIdUpgraded = upgradedFactory?.itemId;
    }
    override undo() {
        const upgradedFactory = this.__flowChartModel?.itemById(this.__itemIdUpgraded ?? '');
        if (!upgradedFactory) return;
        this.__snapshotRedo ??= upgradedFactory.saveToSnapshot();
        upgradedFactory.deleteItem();
        this.__snapshot?.loadFromSnapshot();
    }
}
