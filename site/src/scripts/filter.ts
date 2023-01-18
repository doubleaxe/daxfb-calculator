import {type InjectionKey, type App, reactive, inject} from 'vue';
import {dataProvider, type Item} from './data/data';

class Filter {
    private _tier?: number;
    private _tierEqual = 0;
    private _label?: string;
    private _key?: string;
    private _direction = 0;
    private _subFilter?: Filter;
    private _filtered?: Item[];

    get tier() { return this._tier; }
    set tier(tier: number | undefined) { this._tier = tier; this._filtered = undefined; }

    get tierEqual() { return this._tierEqual; }
    set tierEqual(tierEqual: number) { this._tierEqual = tierEqual; this._filtered = undefined; }

    get label() { return this._label; }
    set label(label: string | undefined) { this._label = label; this._filtered = undefined; }

    get key() { return this._key; }
    set key(key: string | undefined) { this._key = key; this._filtered = undefined; }

    get direction() { return this._direction; }
    set direction(direction: number) { this._direction = direction; this._filtered = undefined; }

    get subFilter() { return this._subFilter; }
    newSubFilter() {
        this._subFilter = new Filter();
        return this._subFilter;
    }
    resetSubFilter() {
        this._subFilter = undefined;
    }

    buildFilter(): Item[] {
        if(this._subFilter)
            return this._subFilter.buildFilter();
        if(this._filtered)
            return this._filtered;
        let filteredItems = dataProvider.getProducerItems();

        //key takes precedence before label
        if(this._key) {
            filteredItems = Filter.filterItems(filteredItems, this._direction, (item) => (item.name == this._key));
        } else if(this._label) {
            const labels = this._label.split(' ').map((s) => s.trim());
            filteredItems = Filter.filterItems(filteredItems, this._direction, (item) => (
                labels.some((l) => item.label.indexOf(l) >= 0)
            ));
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
        return filteredItems;
    }
    private static filterItems(filteredItems: Item[], direction: number, comparator: (item: Item) => boolean) {
        filteredItems = filteredItems.filter((item) => {
            if(comparator(item))
                return true;
            const recipes = dataProvider.getRecipesForItem(item);
            return recipes.some((recipe) => (
                ((direction <= 0) && recipe.input.some((io) => comparator(io.item)))
                || ((direction >= 0) && recipe.output.some((io) => comparator(io.item)))
            ));
        });
        return filteredItems;
    }
}

export const FilterKey = Symbol('Filter') as InjectionKey<Filter>;
export const provideFilter = (app: App) => {
    app.provide(FilterKey, reactive(new Filter()));
};
export const injectFilter = (): Filter => {
    const filter = inject(FilterKey);
    if(!filter)
        throw new Error('filter not instantiated');
    return filter;
};
