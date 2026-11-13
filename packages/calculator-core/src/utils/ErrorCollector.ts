import { LOG, log } from './debug.js';

type MaybeError = {
    message?: string;
    name?: string;
    stack?: string;
};

export class ErrorCollector {
    private readonly _errors: unknown[] = [];

    collectError(error: unknown) {
        this._errors.push(error);
        return this;
    }

    get haveErrors() {
        return !!this._errors.length;
    }

    private static _printError(err: unknown, stack: boolean): string {
        if (Array.isArray(err)) {
            if (!err.length) return 'Unknown error';
            return err.map((_err) => this._printError(_err, stack)).join(': ');
        }
        if (typeof (err as MaybeError).message !== 'string') {
            if (typeof err === 'string' && err.length > 0) {
                return err;
            }
            if (typeof err === 'number' || typeof err === 'boolean') {
                return String(err);
            }
            try {
                return JSON.stringify(err) ?? 'Unknown error';
            } catch {
                return 'Unknown error';
            }
        }
        const _err = err as MaybeError;
        const messages = [_err.name, _err.message, ...(stack ? [_err.stack] : [])]
            .filter((msg) => msg && typeof msg === 'string')
            .join(': ');
        return messages;
    }
    log() {
        this._errors.forEach((err) => {
            log(LOG.ERROR, ErrorCollector._printError(err, true));
        });
    }
    print() {
        return this._errors.map((err) => ErrorCollector._printError(err, false));
    }
}
