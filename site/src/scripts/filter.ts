import {type InjectionKey, type App, reactive, inject} from 'vue';
import {dataProvider, type Item} from './data/data';
import type {InterfaceOf} from './types';

class Filter {
    private _tier?: number;
    private _tierEqual = 0;
    private _groupTier = true;
    private _key?: string;
    private _direction = 0;
    private _filtered?: Item[][];

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

    buildFilter(): Item[][] {
        if(this._filtered)
            return this._filtered;
        let filteredItems = dataProvider.getProducerItems();

        //key takes precedence before label
        if(this._key) {
            const key = this._key;
            filteredItems = filteredItems.filter((item) => {
                if(item.name == key)
                    return true;
                const recipes = dataProvider.getRecipesForItem(item);
                if((this._direction <= 0) && recipes.recipesByInputMap.has(key))
                    return true;
                if((this._direction >= 0) && recipes.recipesByOutputMap.has(key))
                    return true;
                return false;
            });
        }

        if(this._tier) {
            const tier = this._tier;
            filteredItems = filteredItems.filter((item) => {
                if(this._tierEqual > 0)
                    return item.tier >= tier;
                if(this._tierEqual < 0)
                    return item.tier <= tier;
                return item.tier == tier;
            });
        }

        let filteredGroup: Item[][];
        if(this._groupTier) {
            filteredGroup = [];
            for(const item of filteredItems) {
                let array = filteredGroup[(item.tier || 1) - 1];
                if(!array) {
                    array = [];
                    filteredGroup[(item.tier || 1) - 1] = array;
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
export const provideFilter = (app: App): PublicFilter => {
    const filter = reactive(new Filter());
    app.provide(FilterKey, filter);
    return filter;
};
export const injectFilter = (): Filter => {
    const filter = inject(FilterKey);
    if(!filter)
        throw new Error('filter not instantiated');
    return filter;
};
