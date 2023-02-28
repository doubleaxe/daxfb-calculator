/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {Calculator} from '#types/calculator';
import {GameRecipeDictionary} from '#types/game-data';
import {GameItemType, GameRecipeIOType} from '../types/custom-game-data';

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
        if(io.type == GameRecipeIOType.Pump) {
            //pump is quite strange in current vanilla according to my experiments
            //it behaves like a energy, making 2x, but it is still fluid
            //tier list is .125 .25 .5 1 1.25 1.5 1.5
            const pumpTierList = [.125, .25, .5, 1, 1.25, 1.5, 1.5];
            return pumpTierList[tierDiff] || pumpTierList[pumpTierList.length - 1] || 0;
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

    const formatCountPerSecond: Calculator['formatCountPerSecond'] = function(io, count) {
        const productType = io.product.type;
        if(productType == GameItemType.Energy) {
            //energy measured in Watts, 1 Resource Item [R] * 20 = 20 Watt
            count *= 20;
            return {
                count,
                unit: 'W',
            };
        }
        return {
            count,
            unit: 'cps',
        };
    };

    const isCommonIo: Calculator['isCommonIo'] = function(io) {
        return io.type == GameRecipeIOType.Resource;
    };

    return {
        getCountPerSecond,
        formatCountPerSecond,
        isCommonIo,
    };
}
