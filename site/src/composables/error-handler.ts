/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {createGlobalState} from '@vueuse/core';
import {ref} from 'vue';

export const useErrorHandler = createGlobalState(() => {
    const errorHandler = ref<((title: string, error: unknown, isWarning?: boolean) => void) | undefined>();
    function showError(title: string, error: unknown, isWarning?: boolean) {
        errorHandler.value?.(title, error, isWarning);
    }

    return {
        errorHandler,
        showError,
    };
});
