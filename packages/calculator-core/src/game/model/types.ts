import type { PublicInterfaceOf } from '@doubleaxe/daxfb-shared/types/UtilityTypes';

import type { FactoryModelBaseImpl } from './FactoryModel.js';
import type { FlowChartModelBaseImpl } from './FlowChartModel.js';
import type { IOLinkModelBaseImpl } from './IOLinkModel.js';
import type { RecipeIOModelBaseImpl } from './RecipeIOModel.js';
import type { RecipeModelBaseImpl } from './RecipeModel.js';

export type FlowChartModelBase = PublicInterfaceOf<FlowChartModelBaseImpl>;
export type FactoryModelBase = PublicInterfaceOf<FactoryModelBaseImpl>;
export type RecipeModelBase = PublicInterfaceOf<RecipeModelBaseImpl>;
export type RecipeIOModelBase = PublicInterfaceOf<RecipeIOModelBaseImpl>;
export type IOLinkModelBase = PublicInterfaceOf<IOLinkModelBaseImpl>;

export type FactoryConnection = {
    sourceId: string;
    sourceIOId: string;
    targetId: string;
    targetIOId: string;
};
