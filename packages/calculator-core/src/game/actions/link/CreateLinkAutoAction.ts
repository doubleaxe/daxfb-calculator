import type { FactoryModelBaseImpl } from '@daxfb/core/game/model/FactoryModel.js';
import type { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import type { RecipeIOModelBaseImpl } from '@daxfb/core/game/model/RecipeIOModel.js';
import type { FactoryConnection, FlowChartModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';
import { SelectRecipeAction } from '../factory/SelectRecipeAction.js';
import { CreateLinkAction } from './CreateLinkAction.js';

export class CreateLinkAutoAction extends ActionBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    protected readonly __connection: FactoryConnection;
    protected __selectAction: SelectRecipeAction | undefined;
    protected __linkAction: CreateLinkAction | undefined;
    protected __executed = false;

    constructor(flowChart: FlowChartModelBase, connection: FactoryConnection) {
        super();
        this.__flowChart = flowChart as unknown as FlowChartModelBaseImpl;
        this.__connection = connection;
    }

    execute() {
        if (!this.__executed) {
            this.__executed = true;
            const sourceItem = this.__flowChart.itemByKey(this.__connection.sourceId) as
                FactoryModelBaseImpl | undefined;
            const sourceIO = this.__flowChart.findIo(this.__connection.sourceId, this.__connection.sourceIOId) as
                RecipeIOModelBaseImpl | undefined;
            const targetItem = this.__flowChart.itemByKey(this.__connection.targetId) as
                FactoryModelBaseImpl | undefined;
            if (!sourceItem || !sourceIO || !targetItem) return;

            const recipe = targetItem.__possibleRecipesForIo(sourceIO)[0];
            if (!recipe) return;

            if (targetItem.selectedRecipe?.key !== recipe) {
                this.__selectAction = new SelectRecipeAction(this.__flowChart, targetItem, recipe);
                this.__selectAction.execute();
            }

            const targetIO = targetItem.__getIOByKey(sourceIO.key ?? '');
            if (!targetIO) return;

            this.__linkAction = new CreateLinkAction(
                this.__flowChart,
                {
                    sourceId: sourceItem.itemId,
                    sourceIOId: sourceIO.itemId,
                    targetId: targetItem.itemId,
                    targetIOId: targetIO.itemId,
                },
                true
            );
            this.__linkAction.execute();
            return;
        }

        this.__selectAction?.execute();
        this.__linkAction?.execute();
    }

    undo() {
        this.__linkAction?.undo();
        this.__selectAction?.undo();
    }
}
