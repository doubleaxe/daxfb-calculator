import { FactoryModelBaseImpl } from '@daxfb/core/game/model/FactoryModel.js';
import { FlowChartModelBaseImpl } from '@daxfb/core/game/model/FlowChartModel.js';
import { IOLinkModelBaseImpl } from '@daxfb/core/game/model/IOLinkModel.js';
import type { RecipeSnapshotBase } from '@daxfb/core/game/model/ModelSnapshot.js';
import { RecipeIOModelBaseImpl } from '@daxfb/core/game/model/RecipeIOModel.js';
import { RecipeModelBaseImpl } from '@daxfb/core/game/model/RecipeModel.js';

import type { GameDataCoi } from '../parser/index.js';
import type { FlowChartModelCoi } from './types.js';

export class FlowChartModelCoiImpl extends FlowChartModelBaseImpl {
    constructor(gameData: GameDataCoi) {
        super(
            gameData,
            (__flowChart: FlowChartModelCoiImpl, key) => new FactoryModelCoiImpl(__flowChart, key),
            (input: RecipeIOModelCoiImpl, output: RecipeIOModelCoiImpl, snapshot) =>
                new IOLinkModelCoiImpl(input, output, snapshot)
        );
    }
}

export class FactoryModelCoiImpl extends FactoryModelBaseImpl {
    constructor(__flowChart: FlowChartModelCoiImpl, key1: string) {
        super(
            __flowChart,
            key1,
            (factory: FactoryModelCoiImpl, key2, snapshot2) => new RecipeModelCoiImpl(factory, key2, snapshot2)
        );
    }
}

export class RecipeModelCoiImpl extends RecipeModelBaseImpl {
    constructor(__factory: FactoryModelCoiImpl, key1: string, snapshot1?: RecipeSnapshotBase) {
        super(
            __factory,
            key1,
            (recipe: RecipeModelCoiImpl, io, snapshot2) => new RecipeIOModelCoiImpl(recipe, io, snapshot2),
            snapshot1
        );
    }
}

export class RecipeIOModelCoiImpl extends RecipeIOModelBaseImpl {}

export class IOLinkModelCoiImpl extends IOLinkModelBaseImpl {}

export function flowChartModelCoiFactory(gameData: GameDataCoi): FlowChartModelCoi {
    return new FlowChartModelCoiImpl(gameData);
}
