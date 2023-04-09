/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    Calculator,
} from '#types/calculator';
import {GameItemType, GameRecipeIOFlags} from '#types/constants';
import {type GameItemExData, GameItemExType} from '../types/custom-game-data';

export function useCalculator(): Calculator {
    const getCountPerSecond: Calculator['getCountPerSecond'] = function(item, io) {
        if((io.product.type === GameItemType.Energy) || (io.product.type === GameItemType.Special)) {
            return io.count;
        }
        return io.count * 60 / io.recipe.time;
    };

    const unitsForType: {[K in GameItemExType]: string} = {
        [GameItemExType.Unknown]: '',
        [GameItemExType.Electricity]: 'W',
        [GameItemExType.MechPower]: 'W',
        [GameItemExType.Computing]: 'Flops',
        [GameItemExType.Upoints]: 'month',
        [GameItemExType.Maintenance]: 'pm',
        [GameItemExType.Pollution]: '',
        [GameItemExType.Worker]: '',
    };
    const formatCountPerSecond: Calculator['formatCountPerSecond'] = (item, count) => {
        const itemExdata = item.exdata as GameItemExData;
        let unit = itemExdata.exType ? unitsForType[itemExdata.exType] : 'pm';
        if(item.type === GameItemType.Energy) {
            count *= 1000;
        } else if(itemExdata.exType === GameItemExType.Computing) {
            //TFlops by default
            if(count < 1000) {
                unit = 'TFlops';
            } else {
                count *= 1e12;
            }
        }
        return {
            count,
            unit,
        };
    };

    const calculateIoFlags: Calculator['calculateIoFlags'] = function(io) {
        return GameRecipeIOFlags.None;
    };

    return {
        getCountPerSecond,
        formatCountPerSecond,
        calculateIoFlags,
    };
}
