import { FactoryModelBaseImpl } from '@doubleaxe/daxfb-calculator-core/game/model/FactoryModel';
import { FlowChartModelBaseImpl } from '@doubleaxe/daxfb-calculator-core/game/model/FlowChartModel';
import { IOLinkModelBaseImpl } from '@doubleaxe/daxfb-calculator-core/game/model/IOLinkModel';
import { RecipeIOModelBaseImpl } from '@doubleaxe/daxfb-calculator-core/game/model/RecipeIOModel';
import { RecipeModelBaseImpl } from '@doubleaxe/daxfb-calculator-core/game/model/RecipeModel';

import type { GameDataCoi } from '../parser/index.js';

export class FlowChartModelCoiImpl extends FlowChartModelBaseImpl {
    constructor(gameData: GameDataCoi) {
        super(
            gameData,
            (__flowChart: FlowChartModelCoiImpl, key) => new FactoryModelCoiImpl(__flowChart, key),
            (input: RecipeIOModelCoiImpl, output: RecipeIOModelCoiImpl) => new IOLinkModelCoiImpl(input, output)
        );
    }
}

export class FactoryModelCoiImpl extends FactoryModelBaseImpl {
    constructor(__flowChart: FlowChartModelCoiImpl, key1: string) {
        super(__flowChart, key1, (factory: FactoryModelCoiImpl, key2) => new RecipeModelCoiImpl(factory, key2));
    }
}

export class RecipeModelCoiImpl extends RecipeModelBaseImpl {
    constructor(__factory: FactoryModelCoiImpl, key: string) {
        super(__factory, key, (recipe: RecipeModelCoiImpl, io) => new RecipeIOModelCoiImpl(recipe, io));
    }
}

export class RecipeIOModelCoiImpl extends RecipeIOModelBaseImpl {}

export class IOLinkModelCoiImpl extends IOLinkModelBaseImpl {}

export function flowChartModelCoiFactory(gameData: GameDataCoi) {
    return new FlowChartModelCoiImpl(gameData);
}
