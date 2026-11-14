import type { FactoryModelBaseImpl } from '@daxfb/core/game/model/FactoryModel.js';
import type { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import type { IOLinkModelBaseImpl } from '@daxfb/core/game/model/IOLinkModel.js';
import type { RecipeIOModelBaseImpl } from '@daxfb/core/game/model/RecipeIOModel.js';
import type { FactoryConnection, FlowChartModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class CreateLinkAction extends ActionBase {
    protected readonly __flowChart: FlowChartModelBaseImpl;
    protected readonly __connection: FactoryConnection;
    protected readonly __revertIfPossible: boolean;
    protected __sourceItem: FactoryModelBaseImpl | undefined;
    protected __sourceIO: RecipeIOModelBaseImpl | undefined;
    protected __targetItem: FactoryModelBaseImpl | undefined;
    protected __targetIO: RecipeIOModelBaseImpl | undefined;
    protected __createdLink: IOLinkModelBaseImpl | undefined;
    protected __removedLink: IOLinkModelBaseImpl | undefined;
    protected __executed = false;

    constructor(flowChart: FlowChartModelBase, connection: FactoryConnection, revertIfPossible = false) {
        super();
        this.__flowChart = flowChart as unknown as FlowChartModelBaseImpl;
        this.__connection = connection;
        this.__revertIfPossible = revertIfPossible;
    }

    execute() {
        if (!this.__executed) {
            this.__executed = true;
            this.__sourceItem = this.__flowChart.itemByKey(this.__connection.sourceId) as
                FactoryModelBaseImpl | undefined;
            this.__sourceIO = this.__flowChart.findIo(this.__connection.sourceId, this.__connection.sourceIOId) as
                RecipeIOModelBaseImpl | undefined;
            this.__targetItem = this.__flowChart.itemByKey(this.__connection.targetId) as
                FactoryModelBaseImpl | undefined;
            this.__targetIO = this.__flowChart.findIo(this.__connection.targetId, this.__connection.targetIOId) as
                RecipeIOModelBaseImpl | undefined;

            if (!this.__sourceItem || !this.__sourceIO || !this.__targetItem || !this.__targetIO) {
                return;
            }

            const existingLink = this.__sourceIO.__findAlreadyLinked(this.__targetIO);
            this.__createdLink = this.__flowChart.__createLink(
                this.__sourceItem,
                this.__sourceIO,
                this.__targetItem,
                this.__targetIO,
                this.__revertIfPossible
            ) as IOLinkModelBaseImpl | undefined;
            this.__removedLink = !this.__createdLink && this.__revertIfPossible ? existingLink : undefined;
            return;
        }

        if (this.__removedLink) {
            this.__flowChart.__deleteLink(this.__removedLink);
        }
        if (this.__createdLink) {
            this.__flowChart.__insertLink(this.__createdLink);
        }
    }

    undo() {
        if (this.__createdLink) {
            this.__flowChart.__deleteLink(this.__createdLink);
        }
        if (this.__removedLink) {
            this.__flowChart.__insertLink(this.__removedLink);
        }
    }
}
