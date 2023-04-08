/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    Calculator,
} from '#types/calculator';
import {GameItemType, GameRecipeIOFlags} from '#types/contants';

export function useCalculator(): Calculator {
    const getCountPerSecond: Calculator['getCountPerSecond'] = function(item, io) {
        if((item.type === GameItemType.Energy) || (item.type === GameItemType.Special)) {
            return io.count;
        }
        return io.count * 60 / io.recipe.time;
    };

    const formatCountPerSecond: Calculator['formatCountPerSecond'] = (item, count) => {
        let unit = 'pm';
        if(item.type === GameItemType.Energy) {
            unit = 'W';
            count *= 1000;
        }
        if(item.type === GameItemType.Special) {
            unit = '';
        }
        return {
            count,
            unit,
        };
    };

    const dynamicFlags: Calculator['dynamicFlags'] = function(io) {
        return GameRecipeIOFlags.None;
    };

    return {
        getCountPerSecond,
        formatCountPerSecond,
        dynamicFlags,
    };
}
