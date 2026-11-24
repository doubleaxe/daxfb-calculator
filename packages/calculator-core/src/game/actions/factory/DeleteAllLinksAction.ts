import { LoadFromSnapshotStage, type RecipeSnapshotBase } from '#core/game/model/ModelSnapshot.js';

import { FactoryActionBase } from './FactoryActionBase.js';

export class DeleteAllLinksAction extends FactoryActionBase {
    private __snapshot: RecipeSnapshotBase | undefined;

    override redo() {
        const factory = this.__factory;
        if (!factory) return;
        this.__snapshot ??= factory.selectedRecipe?.saveToSnapshot();
        factory.deleteAllLinks();
    }
    override undo() {
        this.__snapshot?.loadFromSnapshot({ stage: LoadFromSnapshotStage.FACTORY_LINK });
    }
}
