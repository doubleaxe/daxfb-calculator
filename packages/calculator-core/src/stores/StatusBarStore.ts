import type { InterfaceOf } from '@daxfb/shared/types/UtilityTypes.js';
import { createInjectionState } from '@vueuse/core';
import { reactive } from 'vue';

export class StatusBarStoreImpl {
    hoveredItem: string | undefined;
    selectedItem: string | undefined;

    setHoveredItem(item: string | undefined) {
        this.hoveredItem = item;
    }
    setSelectedItem(item: string | undefined) {
        this.selectedItem = item;
    }
}

export type StatusBarStore = InterfaceOf<StatusBarStoreImpl>;

const [useProvideStatusBarStore, _useStatusBarStore] = createInjectionState(
    (statusBarStore: StatusBarStore): StatusBarStore => reactive(statusBarStore)
);

export { useProvideStatusBarStore };
export function useStatusBarStore() {
    const statusBarStore = _useStatusBarStore();
    if (!statusBarStore) {
        throw new Error('StatusBarStore is not provided');
    }
    return statusBarStore;
}
