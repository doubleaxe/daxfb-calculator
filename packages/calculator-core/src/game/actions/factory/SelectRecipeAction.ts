import type { RecipeSnapshotBase } from '#core/game/model/ModelSnapshot.js';

import { FactoryActionBase } from './FactoryActionBase.js';

export class SelectRecipeAction extends FactoryActionBase {
    private readonly __recipeKey: string;
    private __snapshot: RecipeSnapshotBase | undefined;
    private __snapshotRedo: RecipeSnapshotBase | undefined;

    constructor(itemId: string, recipeKey: string) {
        super(itemId);
        this.__recipeKey = recipeKey;
    }

    override redo() {
        if (this.__snapshotRedo !== undefined) {
            this.__snapshotRedo.loadFromSnapshot();
            return;
        }
        const factory = this.__factory;
        if (!factory) return;
        this.__snapshot ??= factory.selectedRecipe?.saveToSnapshot();
        factory.selectRecipe(this.__recipeKey);
    }
    override undo() {
        const factory = this.__factory;
        if (!factory) return;
        this.__snapshotRedo ??= factory.selectedRecipe?.saveToSnapshot();
        this.__snapshot?.loadFromSnapshot();
    }
}
