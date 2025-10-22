import type { PublicInterfaceOf } from '#daxfb-shared/types/UtilityTypes';

import type { FactoryModelBaseImpl } from './FactoryModel';
import type { FlowChartModelBaseImpl } from './FlowChartModel';
import type { IOLinkModelBaseImpl } from './IOLinkModel';
import type { RecipeIOModelBaseImpl } from './RecipeIOModel';
import type { RecipeModelBaseImpl } from './RecipeModel';

export type FactoryModelBase = PublicInterfaceOf<FactoryModelBaseImpl>;
export type IOLinkModelBase = PublicInterfaceOf<IOLinkModelBaseImpl>;
export type RecipeIOModelBase = PublicInterfaceOf<RecipeIOModelBaseImpl>;
export type RecipeModelBase = PublicInterfaceOf<RecipeModelBaseImpl>;
export type FlowChartModelBase = PublicInterfaceOf<FlowChartModelBaseImpl>;

export type FactoryConnection = {
    sourceId: string;
    sourceIOId: string;
    targetId: string;
    targetIOId: string;
};
