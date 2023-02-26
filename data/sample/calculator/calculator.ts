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

    const isCommonIo: Calculator['isCommonIo'] = function(io) {
        return false;
    };

    return {
        getCountPerSecond,
        isCommonIo,
    };
}
