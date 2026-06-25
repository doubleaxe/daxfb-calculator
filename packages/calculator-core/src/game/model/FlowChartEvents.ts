import type { Unsubscribe } from 'nanoevents';
import { type DependencyList, useEffect } from 'react';

import type { FactoryModelBase } from './types.js';

export type FlowChartEventsBase = {
    paneClickAnywhere: (event: MouseEvent) => void;
    solveGraph: (changedItems: FactoryModelBase[]) => void;
};

export function useFlowChartEvents(subscriber: () => Unsubscribe[], deps?: DependencyList) {
    useEffect(() => {
        const unsubscribe = subscriber();
        return () => {
            unsubscribe.forEach((unsub) => unsub());
        };
    }, deps);
}
