/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import {ref} from 'vue';
import {__DEBUG__} from '@/scripts/debug';

const linkApiAddress = __DEBUG__ ? 'http://localhost:8080/linkapi/' : 'https://daxfb-blueprints.xdax.ru/linkapi/';

export function useLinkApi() {
    const isLoading = ref(false);
    const abortController = ref<AbortController | undefined>();

    type ErrorResponse = {
        error: string;
        message: string;
    };

    function exec<T>(command: string, body: unknown) {
        const _abortController = new AbortController();
        const signal = _abortController.signal;
        return Promise.resolve()
            .then(() => {
                isLoading.value = true;
                abortController.value = _abortController;
                return fetch(`${linkApiAddress}${command}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                    signal,
                });
            })
            .then((response) => {
                if(signal.aborted) {
                    const err = new Error('aborted');
                    err.name = 'AbortError';
                    throw err;
                }
                if(response.ok || (response.status == 500)) {
                    return response.json()
                        .then((jsonData: ErrorResponse | unknown) => {
                            if(!response.ok || (jsonData as ErrorResponse).error) {
                                const errorData = jsonData as ErrorResponse;
                                if(errorData.error) {
                                    const error = new Error(`server returned error "${errorData.message}"`);
                                    error.name = errorData.error;
                                    throw error;
                                } else {
                                    throw new Error(`server returned error ${response.status}: ${response.statusText}`);
                                }
                            }
                            return jsonData as T;
                        });
                } else {
                    throw new Error(`server returned error ${response.status}: ${response.statusText}`);
                }
            })
            .finally(() => {
                isLoading.value = false;
                abortController.value = undefined;
            });
    }

    return {
        exec,
        abortController,
        isLoading,
    };
}
