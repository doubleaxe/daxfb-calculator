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
    if(severity <= LOG.INFO) {
        console.log(...data);
    } else {
        console.warn(...data);
    }
} : (severity: LogSeverity, ...data: unknown[]) => { /**/ };
