import { useContext } from 'react';

import { FlowChartModelContext } from '#core/game/model';

import type { FlowChartModelCoi } from './types';

export function useFlowChartModelCoi() {
    const flowChartModel = useContext(FlowChartModelContext);
    if (!flowChartModel) {
        throw new Error('GameContext was not found');
    }
    return flowChartModel as FlowChartModelCoi;
}
