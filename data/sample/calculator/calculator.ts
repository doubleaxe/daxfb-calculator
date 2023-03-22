/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    Calculator,
} from '#types/calculator';
import type {FromatCountPerSecond, GameItem} from '#types/game-data';

export function useCalculator(): Calculator {
    const getCountPerSecond: Calculator['getCountPerSecond'] = function(item, io) {
        return io.count * (item.recipe?.tier || 1) / io.recipe.time;
    };

    function formatCount(item: GameItem, count: number): FromatCountPerSecond {
        return {
            count,
            unit: (item.name == 'R') ? 'W' : 'ps',
        };
    }
    const formatCountPerSecond: Calculator['formatCountPerSecond'] = function(io, count) {
        return formatCount(io.product, count);
    };

    const formatTransportFlow: Calculator['formatTransportFlow'] = function(transport, flow) {
        return formatCount(transport.item, flow);
    };

    const isCommonIo: Calculator['isCommonIo'] = function(io) {
        return false;
    };

    return {
        getCountPerSecond,
        formatCountPerSecond,
        formatTransportFlow,
        isCommonIo,
    };
}
