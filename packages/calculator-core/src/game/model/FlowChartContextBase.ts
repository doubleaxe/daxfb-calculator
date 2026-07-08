import { createInjectionState } from '@vueuse/core';

import type { FlowChartModelBase } from './types.js';

const [useProvideFlowChartModelBase, _useFlowChartModelBase] = createInjectionState(
    (flowChartModel: FlowChartModelBase) => flowChartModel
);

export { useProvideFlowChartModelBase };
export function useFlowChartModelBase() {
    const flowChartModel = _useFlowChartModelBase();
    if (!flowChartModel) {
        throw new Error('FlowChartModel is not provided');
    }
    return flowChartModel;
}
