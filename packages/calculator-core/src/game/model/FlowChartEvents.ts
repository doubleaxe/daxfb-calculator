import { tryOnScopeDispose } from '@vueuse/core';
import type { Unsubscribe } from 'nanoevents';

import type { FactoryModelBase } from './types.js';

export type FlowChartEventsBase = {
    paneClickAnywhere: (event: MouseEvent) => void;
    solveGraph: (changedItems: FactoryModelBase[]) => void;
};

export function useFlowChartEvents(subscriber: () => Unsubscribe[]) {
    const unsubscribe = subscriber();
    tryOnScopeDispose(() => {
        unsubscribe.forEach((unsub) => unsub());
    });
}
