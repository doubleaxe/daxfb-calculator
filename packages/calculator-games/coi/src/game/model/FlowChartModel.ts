import { FactoryModelBaseImpl } from '@daxfb/core/game/model/FactoryModel.js';
import { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import { IOLinkModelBaseImpl } from '@daxfb/core/game/model/IOLinkModel.js';
import type { FactorySnapshotBase, RecipeSnapshotBase } from '@daxfb/core/game/model/ModelSnapshot.js';
import { RecipeIOModelBaseImpl } from '@daxfb/core/game/model/RecipeIOModel.js';
import { RecipeModelBaseImpl } from '@daxfb/core/game/model/RecipeModel.js';

import type { GameDataCoi } from '../parser/index.js';
import type { FlowChartModelCoi } from './types.js';

export class FlowChartModelCoiImpl extends FlowChartModelBaseImpl {
    constructor(gameData: GameDataCoi) {
        super(
            gameData,
            (__flowChart: FlowChartModelCoiImpl, key, snapshot1) =>
                new FactoryModelCoiImpl(__flowChart, key, snapshot1),
            (input: RecipeIOModelCoiImpl, output: RecipeIOModelCoiImpl, snapshot2) =>
                new IOLinkModelCoiImpl(input, output, snapshot2)
        );
    }
}

export class FactoryModelCoiImpl extends FactoryModelBaseImpl {
    constructor(__flowChart: FlowChartModelCoiImpl, key1: string, snapshot1: FactorySnapshotBase | undefined) {
        super(
            __flowChart,
            key1,
            snapshot1,
            (factory: FactoryModelCoiImpl, key2, snapshot2) => new RecipeModelCoiImpl(factory, key2, snapshot2)
        );
    }
}

export class RecipeModelCoiImpl extends RecipeModelBaseImpl {
    constructor(__factory: FactoryModelCoiImpl, key1: string, snapshot1: RecipeSnapshotBase | undefined) {
        super(
            __factory,
            key1,
            snapshot1,
            (recipe: RecipeModelCoiImpl, io, snapshot2) => new RecipeIOModelCoiImpl(recipe, io, snapshot2)
        );
    }
}

export class RecipeIOModelCoiImpl extends RecipeIOModelBaseImpl {}

export class IOLinkModelCoiImpl extends IOLinkModelBaseImpl {}

export function flowChartModelCoiFactory(gameData: GameDataCoi): FlowChartModelCoi {
    return new FlowChartModelCoiImpl(gameData);
}
