import type { InterfaceOf } from '@daxfb/shared/types/UtilityTypes.js';
import { createInjectionState } from '@vueuse/core';
import { reactive } from 'vue';

import type { HistoryManagerImpl } from './HistoryManager.js';

export type HistoryManager = InterfaceOf<HistoryManagerImpl>;

const [useProvideHistoryManager, _useHistoryManager] = createInjectionState(
    (historyManager: HistoryManager): HistoryManager => reactive(historyManager)
);

export { useProvideHistoryManager };
export function useHistoryManager() {
    const historyManager = _useHistoryManager();
    if (!historyManager) {
        throw new Error('HistoryManager is not provided');
    }
    return historyManager;
}
