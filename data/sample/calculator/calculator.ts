/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    Calculator,
} from '#types/calculator';

export function useCalculator(): Calculator {
    const getCountPerSecond: Calculator['getCountPerSecond'] = function(item, io) {
        return io.count / io.recipe.time;
    };

    const formatCountPerSecond: Calculator['formatCountPerSecond'] = function(io, count) {
        return {
            count,
            unit: (io.product.name == 'R') ? 'W' : 'cps',
        };
    };

    const isCommonIo: Calculator['isCommonIo'] = function(io) {
        return false;
    };

    return {
        getCountPerSecond,
        formatCountPerSecond,
        isCommonIo,
    };
}
