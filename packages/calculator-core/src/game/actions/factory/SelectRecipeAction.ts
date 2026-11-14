import type { FactoryModelBaseImpl } from '@daxfb/core/game/model/FactoryModel.js';
import type { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import type { IOLinkModelBaseImpl } from '@daxfb/core/game/model/IOLinkModel.js';
import type { RecipeModelBaseImpl } from '@daxfb/core/game/model/RecipeModel.js';
import type { FactoryModelBase, FlowChartModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class SelectRecipeAction extends ActionBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    protected readonly __item: FactoryModelBaseImpl;
    protected readonly __key: string;
    protected __oldRecipe: RecipeModelBaseImpl | undefined;
    protected __newRecipe: RecipeModelBaseImpl | undefined;
    protected __oldLinks: IOLinkModelBaseImpl[] = [];
    protected __newLinks: IOLinkModelBaseImpl[] = [];
    protected __executed = false;

    constructor(flowChart: FlowChartModelBase, item: FactoryModelBase, key: string) {
        super();
        this.__flowChart = flowChart as unknown as FlowChartModelBaseImpl;
        this.__item = item as unknown as FactoryModelBaseImpl;
        this.__key = key;
    }

    execute() {
        if (!this.__executed) {
            this.__executed = true;
            this.__oldRecipe = this.__item.selectedRecipe as RecipeModelBaseImpl | undefined;
            this.__oldLinks = this.__oldRecipe?.__getAllLinks() ?? [];

            if (!this.__item.__selectRecipe(this.__key)) {
                this.__newRecipe = this.__oldRecipe;
                this.__newLinks = this.__oldLinks;
                return;
            }

            this.__newRecipe = this.__item.selectedRecipe as RecipeModelBaseImpl | undefined;
            this.__newLinks = this.__newRecipe?.__getAllLinks() ?? [];
            return;
        }

        for (const link of this.__oldLinks) {
            this.__flowChart.__deleteLink(link);
        }
        this.__item.__setSelectedRecipe(this.__newRecipe);
        for (const link of this.__newLinks) {
            this.__flowChart.__insertLink(link);
        }
    }

    undo() {
        for (const link of this.__newLinks) {
            this.__flowChart.__deleteLink(link);
        }
        this.__item.__setSelectedRecipe(this.__oldRecipe);
        for (const link of this.__oldLinks) {
            this.__flowChart.__insertLink(link);
        }
    }
}
