/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import {useEventListener} from '@vueuse/core';

export type LoadScriptOptions<T> = {
    timeout?: number;
    globalVariable?: string;
    validationCallback?: (globalVariable?: unknown) => T | undefined;
    attributes?: {[key: string]: string};
};
export function loadScript<T>(src: string, options: LoadScriptOptions<T> = {}): Promise<T | true> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.setAttribute('async', 'async');
        script.setAttribute('src', src);
        for(const [key, value] of Object.entries(options.attributes || {})) {
            script.setAttribute(key, value);
        }

        const cleanupArray: (() => void)[] = [];
        function cleanup() {
            cleanupArray.forEach((c) => c());
        }

        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error(`Timeout loading script: ${src}`));
        }, options.timeout || 60000);
        cleanupArray.push(() => clearTimeout(timeout));

        function validateObject() {
            if(!options.globalVariable && !options.validationCallback)
                return true;
            let globalVariable: unknown = undefined;
            if(options.globalVariable) {
                try {
                    globalVariable = (window as unknown as {[key: string]: unknown})[options.globalVariable];
                } catch(err) {
                    return undefined;
                }
            }
            if(options.validationCallback) {
                return options.validationCallback(globalVariable);
            }
            return globalVariable;
        }
        function pollResolved() {
            const valid = validateObject();
            if(valid === undefined)
                return;
            cleanup();
            resolve((valid === true) ? true : (valid as T));
        }

        cleanupArray.push(useEventListener(script, ['error', 'abort'], () => {
            cleanup();
            reject(new Error(`Failed to load script: ${src}`));
        }));

        cleanupArray.push(useEventListener(script, 'load', () => {
            pollResolved();
        }));

        document.head.appendChild(script);

        const interval = setInterval(() => {
            pollResolved();
        }, 100);
        cleanupArray.push(() => clearInterval(interval));
    });
}
