/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItem} from '#types/game-data';
import {type InjectionKey, provide, reactive, inject} from 'vue';
import type {GameData} from './data';
import type {InterfaceOf} from './types';

class Filter {
    private readonly _gameData: GameData;
    private _tier?: number;
    private _tierEqual = 0;
    private _groupTier = true;
    private _key?: string;
    private _direction = 0;
    private _filtered?: GameItem[][];

    constructor(_gameData: GameData) {
        this._gameData = _gameData;
    }

    get tier() { return this._tier; }
    set tier(tier: number | undefined) { this._tier = tier; this._filtered = undefined; }

    get tierEqual() { return this._tierEqual; }
    set tierEqual(tierEqual: number) { this._tierEqual = tierEqual; this._filtered = undefined; }

    get groupTier() { return this._groupTier; }
    set groupTier(groupTier: boolean) { this._groupTier = groupTier; this._filtered = undefined; }

    get key() { return this._key; }
    set key(key: string | undefined) { this._key = key; this._filtered = undefined; }

    get direction() { return this._direction; }
    set direction(direction: number) { this._direction = direction; this._filtered = undefined; }

    buildFilter(): GameItem[][] {
        if(this._filtered)
            return this._filtered;
        let filteredItems = this._gameData.gameFactoriesArray;

        //key takes precedence before label
        if(this._key) {
            const key = this._key;
            filteredItems = filteredItems.filter((item) => {
                if(item.name == key)
                    return true;
                const recipeDictionary = item.recipeDictionary;
                if((this._direction <= 0) && recipeDictionary?.recipesByInputMap?.has(key))
                    return true;
                if((this._direction >= 0) && recipeDictionary?.recipesByOutputMap?.has(key))
                    return true;
                return false;
            });
        }

        if(this._tier !== undefined) {
            const tier = this._tier;
            filteredItems = filteredItems.filter((item) => {
                const itemTier = item.recipe?.tier || 0;
                if(this._tierEqual > 0)
                    return itemTier >= tier;
                if(this._tierEqual < 0)
                    return itemTier <= tier;
                return itemTier == tier;
            });
        }

        const minTier = this._gameData.gameDescription.minTier;
        let filteredGroup: GameItem[][];
        if(this._groupTier) {
            filteredGroup = [];
            for(const item of filteredItems) {
                const itemTier = item.recipe?.tier || 0;
                let array = filteredGroup[itemTier - minTier];
                if(!array) {
                    array = [];
                    filteredGroup[itemTier - minTier] = array;
                }
                array.push(item);
            }
        } else {
            filteredGroup = [filteredItems];
        }
        this._filtered = filteredGroup;
        return this._filtered;
    }
}
export type PublicFilter = InterfaceOf<Filter>;

export const FilterKey = Symbol('Filter') as InjectionKey<Filter>;
export const provideFilter = (gameData: GameData): PublicFilter => {
    const filter = reactive(new Filter(gameData));
    provide(FilterKey, filter);
    return filter;
};
export const injectFilter = (): Filter => {
    const filter = inject(FilterKey);
    if(!filter)
        throw new Error('filter not instantiated');
    return filter;
};
