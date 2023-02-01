/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {LOG, log} from './debug';

type MaybeError = {
    name?: string;
    message?: string;
    stack?: string;
};

export class ErrorCollector {
    private readonly _errors: unknown[] = [];

    collectError(error: unknown) {
        this._errors.push(error);
        return this;
    }

    get haveErrors() { return !!this._errors.length; }

    private static _printError(err: unknown, stack: boolean): string {
        if(Array.isArray(err)) {
            if(!err.length)
                return 'Unknown error';
            return err.map((_err) => this._printError(_err, stack)).join(': ');
        }
        if(typeof((err as MaybeError).message) != 'string') {
            return err ? String(err) : 'Unknown error';
        }
        const _err = err as MaybeError;
        const messages = [
            _err.name,
            _err.message,
            ...(stack ? [_err.stack] : []),
        ].filter((msg) => (msg && (typeof(msg) == 'string'))).join(': ');
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
