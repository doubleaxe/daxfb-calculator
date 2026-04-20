import type { PublicInterfaceOf } from '@doubleaxe/daxfb-shared/types/UtilityTypes';

import type {
    FactoryModelCoiImpl,
    FlowChartModelCoiImpl,
    IOLinkModelCoiImpl,
    RecipeIOModelCoiImpl,
    RecipeModelCoiImpl,
} from './FlowChartModel.js';
import { flowChartModelCoiFactory } from './FlowChartModel.js';

export type FlowChartModelCoi = PublicInterfaceOf<FlowChartModelCoiImpl>;
export type FactoryModelCoi = PublicInterfaceOf<FactoryModelCoiImpl>;
export type RecipeModelCoi = PublicInterfaceOf<RecipeModelCoiImpl>;
export type RecipeIOModelCoi = PublicInterfaceOf<RecipeIOModelCoiImpl>;
export type IOLinkModelCoi = PublicInterfaceOf<IOLinkModelCoiImpl>;
export { flowChartModelCoiFactory };
