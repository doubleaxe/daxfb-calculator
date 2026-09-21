import type { InterfaceOf } from '@doubleaxe/daxfb-shared/types/UtilityTypes';
import { createInjectionState } from '@vueuse/core';
import { reactive } from 'vue';

import type { GameDataBase } from '#core/game/parser/index.js';

export class FilterStoreBaseImpl {
    readonly gameData;
    protected _key: string | undefined;
    protected _direction = 0;

    constructor(gameData: GameDataBase) {
        this.gameData = gameData;
    }

    get filter() {
        let filteredItems = this.gameData.gameFactoriesArray;
        // key takes precedence before label
        // support filtering by abstract item class
        const key = this._key;
        const filterItem = key ? this.gameData.getGameItem(key) : undefined;
        if (key && filterItem) {
            filteredItems = filteredItems.filter((item) => {
                if (item.key === key) return true;
                const recipeDictionary = item.recipeDictionary;
                if (this._direction <= 0 && recipeDictionary?.recipesByInputMap?.has(key)) return true;
                if (this._direction >= 0 && recipeDictionary?.recipesByOutputMap?.has(key)) return true;
                return false;
            });
        }

        const filteredGroup = [filteredItems];
        return filteredGroup;
    }
    get key() {
        return this._key;
    }
    get direction() {
        return this._direction;
    }

    setKey(key: string | undefined) {
        this._key = key;
    }
    setDirection(direction: number) {
        this._direction = direction;
    }
}

export type FilterStoreBase = InterfaceOf<FilterStoreBaseImpl>;

const [useProvideFilterStoreBase, _useFilterStoreBase] = createInjectionState(
    (filterStore: FilterStoreBase): FilterStoreBase => reactive(filterStore)
);

export { useProvideFilterStoreBase };
export function useFilterStoreBase() {
    const filterStore = _useFilterStoreBase();
    if (!filterStore) {
        throw new Error('FilterStore is not provided');
    }
    return filterStore;
}
