import { createInjectionState, useDark } from '@vueuse/core';

const [useProvideDarkModeStore, useDarkModeStore] = createInjectionState(() =>
    useDark({
        selector: 'body',
        attribute: 'class',
        valueDark: 'daxfb-dark',
        valueLight: 'daxfb-light',
        storageKey: 'daxfb-dark-mode',
    })
);
export { useDarkModeStore, useProvideDarkModeStore };
