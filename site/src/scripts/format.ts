/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {RecipeIOModel, TransportModel} from './model/store';

const decimals = 3;
const upperPrefixes = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q'];
const lowerPrefixes = ['m', 'μ', 'n', 'p', 'f', 'a', 'z', 'y', 'r', 'q'];

function formatDigits(n: number, prefix?: string, units?: string) {
    return parseFloat((n).toPrecision(decimals)).toString() + (prefix || '') + (units || '');
}

export function formatNumber(n: number | undefined, units?: string) {
    if(n === undefined)
        return '';
    if(n === 0)
        return '0' + (units || '');

    const abs = Math.abs(n);
    let i = 0;
    let prefix: string | undefined = undefined;
    if(abs >= 1) {
        const exponent = Math.floor((Math.log(abs) / Math.log(10)) + Number.EPSILON);
        if(exponent < 3)
            return formatDigits(n, units);
        i = Math.floor(exponent / 3);
        prefix = upperPrefixes[i - 1];
    } else {
        const exponent = Math.floor((Math.log(abs) / Math.log(10)) - Number.EPSILON);
        if(exponent > -3)
            return formatDigits(n, units);
        i = Math.floor(exponent / 3);
        prefix = lowerPrefixes[(-i) - 1];
    }

    if(prefix === undefined) {
        //not convertable
        return n.toExponential(decimals);
    }
    const base = n / (1000 ** i);
    return formatDigits(base, prefix, units);
}

export function formatIo(n: number | undefined, io: RecipeIOModel) {
    if(n === undefined)
        return '';
    const format = io.formatCountPerSecond(n);
    return formatNumber(format.count, format.unit);
}

export function formatTransport(n: number | undefined, transport: TransportModel) {
    if(n === undefined)
        return '';
    const format = transport.formatCountPerSecond(n);
    return formatNumber(format.count, format.unit);
}
