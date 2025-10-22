import { createContext, useContext } from 'react';

import type { FlowChartModelBase } from './types';

export const FlowChartModelContext = createContext(null as FlowChartModelBase | null);
export function useFlowChartModelBase() {
    const flowChartModel = useContext(FlowChartModelContext);
    if (!flowChartModel) {
        throw new Error('FlowChartModelContext was not found');
    }
    return flowChartModel;
}
