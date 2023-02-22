/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {Calculator} from '#types/calculator';
import {GameRecipeDictionary} from '#types/game-data';
import {GameRecipeIOType} from '../types/custom-game-data';

export function useCalculator(): Calculator {
    const TICKS_PER_SECOND = 20;
    //const WATTS_PER_ITEM = 20;

    function minItemTier(recipeDictionary: GameRecipeDictionary) {
        const items = [...recipeDictionary.items];
        items.sort((i1, i2) => (i1.recipe?.tier ?? 0) - (i2.recipe?.tier ?? 0));
        return items[0]?.recipe?.tier ?? 0;
    }
    const getCountPerSecond: Calculator['getCountPerSecond'] = function(item, io) {
        const recipeTier = minItemTier(io.recipe.recipeDictionary);
        const factoryTier = item.recipe?.tier || recipeTier;
        let tierDiff = factoryTier - recipeTier;
        if(tierDiff < 0) {
            console.error(`Something wrong, item tier ${factoryTier} < recipe tier ${recipeTier} => ${io.recipe.name}`);
            tierDiff = 0;
        }
        if(io.type == GameRecipeIOType.Resource) {
            //1 Resource Item [R] * 20 = 20 Watt, time doesn't matter
            //each resource tier doubles energy consuption/production (cumulative)
            return io.count * Math.pow(2, tierDiff);
        }
        //each item tier makes production 1.5x times faster (cumulative)
        //each tick takes 20 seconds
        const unitMul = io.product.unitMul || 1;
        return (io.count * unitMul * Math.pow(1.5, tierDiff) * TICKS_PER_SECOND) / io.recipe.time;
    };

    return {
        getCountPerSecond,
    };
}
