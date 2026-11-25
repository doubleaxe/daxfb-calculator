import type { FactorySnapshotBase } from '#core/game/model/ModelSnapshot.js';

import { FactoryActionBase } from './FactoryActionBase.js';

export class DeleteFactoryAction extends FactoryActionBase {
    private __snapshot: FactorySnapshotBase | undefined;

    override redo() {
        const factory = this.__factory;
        if (!factory) return;
        this.__snapshot ??= factory.saveToSnapshot();
        factory.deleteItem();
    }
    override undo() {
        this.__snapshot?.loadFromSnapshot();
    }
}
