/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export const __DEBUG__ = import.meta.env.DEV;

export const LOG = {
    TRACE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5,
} as const;
export type LogSeverity = typeof LOG[keyof typeof LOG];

export const log = (__DEBUG__ && typeof(console.log) == 'function') ? (severity: LogSeverity, ...data: unknown[]) => {
    try {
        if(severity <= LOG.INFO) {
            console.log(...data);
        } else if(severity <= LOG.WARN) {
            console.warn(...data);
        } else {
            console.error(...data);
        }
    } catch(err) { /**/ }
} : (severity: LogSeverity, ...data: unknown[]) => { /**/ };
