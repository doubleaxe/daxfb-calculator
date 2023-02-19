/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    Calculator,
} from '#types/calculator';

import {GameRecipeIOType} from '../types/custom-game-data';

export function useCalculator(): Calculator {
    const TICKS_PER_SECOND = 20;
    //const WATTS_PER_ITEM = 20;

    const getCountPerSecond: Calculator['getCountPerSecond'] = function(item, recipe, io, exData) {
        const recipeTier = exData.minItemTier;
        const factoryTier = item.recipe?.tier || recipeTier;
        let tierDiff = factoryTier - recipeTier;
        if(tierDiff < 0) {
            console.error(`Something wrong, item tier ${factoryTier} < recipe tier ${recipeTier} => ${recipe.name}`);
            tierDiff = 0;
        }
        if(io.io.type == GameRecipeIOType.Resource) {
            //1 Resource Item [R] * 20 = 20 Watt, time doesn't matter
            //each resource tier doubles energy consuption/production (cumulative)
            return io.io.count * Math.pow(2, tierDiff);
        }
        //each item tier makes production 1.5x times faster (cumulative)
        //each tick takes 20 seconds
        const unitMul = io.item.unitMul || 1;
        return (io.io.count * unitMul * Math.pow(1.5, tierDiff) * TICKS_PER_SECOND) / recipe.time;
    };

    return {
        getCountPerSecond,
    };
}
