import type { PublicInterfaceOf } from '#daxfb-shared/types/UtilityTypes';

import type { FactoryModelBaseImpl } from './FactoryModel';
import type { FlowChartModelBaseImpl } from './FlowChartModel';
import type { IOLinkModelBaseImpl } from './IOLinkModel';
import type { RecipeIOModelBaseImpl } from './RecipeIOModel';
import type { RecipeModelBaseImpl } from './RecipeModel';

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
