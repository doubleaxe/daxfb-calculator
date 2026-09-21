import { useFlowChartModelBase } from '@doubleaxe/daxfb-calculator-core/game/model';

import type { FlowChartModelCoi } from './types.js';

export function useFlowChartModelCoi() {
    return useFlowChartModelBase() as FlowChartModelCoi;
}
