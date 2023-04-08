/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    Calculator,
} from '#types/calculator';

export function useCalculator(): Calculator {
    const getCountPerSecond: Calculator['getCountPerSecond'] = function(item, io) {
        return io.count * (item.recipe?.tier || 1) / io.recipe.time;
    };

    const formatCountPerSecond: Calculator['formatCountPerSecond'] = (item, count) => {
        return {
            count,
            unit: (item.name == 'R') ? 'W' : 'ps',
        };
    };

    return {
        getCountPerSecond,
        formatCountPerSecond,
    };
}
