import { FlowChartModelContext } from '@doubleaxe/daxfb-calculator-core/game/model';
import { useContext } from 'react';

import type { FlowChartModelCoi } from './types.js';

export function useFlowChartModelCoi() {
    const flowChartModel = useContext(FlowChartModelContext);
    if (!flowChartModel) {
        throw new Error('GameContext was not found');
    }
    return flowChartModel as FlowChartModelCoi;
}
