import { createInjectionState, useDark } from '@vueuse/core';

const [useProvideDarkModeStore, _useDarkModeStore] = createInjectionState(() =>
    useDark({
        selector: 'html',
        attribute: 'class',
        valueDark: 'daxfb-dark',
        valueLight: 'daxfb-light',
        storageKey: 'daxfb-dark-mode',
    })
);

export { useProvideDarkModeStore };
export function useDarkModeStore() {
    const isDarkMode = _useDarkModeStore();
    if (!isDarkMode) {
        throw new Error('isDarkMode is not provided');
    }
    return isDarkMode;
}
