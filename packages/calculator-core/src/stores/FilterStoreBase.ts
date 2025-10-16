import { action, computed, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

import type { GameDataBase } from '#core/game/parser';
import { isAbstractClassItem } from '#core/game/parser';
import type { InterfaceOf } from '#daxfb-shared/types/UtilityTypes';

export class FilterStoreBaseImpl {
    readonly gameData;
    protected _key: string | undefined;
    protected _direction = 0;

    constructor(gameData: GameDataBase) {
        this.gameData = gameData;

        makeObservable<FilterStoreBaseImpl, '_direction' | '_key'>(this, {
            _key: observable,
            _direction: observable,
            setKey: action,
            filter: computed,
        });
    }

    get filter() {
        let filteredItems = this.gameData.gameFactoriesArray;
        // key takes precedence before label
        // support filtering by abstract item class
        const key = this._key;
        const filterItem = key ? this.gameData.getGameItem(key) : undefined;
        if (key && filterItem) {
            const abstractFilterItemType = isAbstractClassItem(filterItem) ? filterItem.type : undefined;
            const relativeAbsractItem = filterItem.type
                ? this.gameData.gameAbstractItems.get(filterItem.type)
                : undefined;
            filteredItems = filteredItems.filter((item) => {
                if (item.key === key) return true;
                const recipeDictionary = item.recipeDictionary;
                if (this._direction <= 0 && recipeDictionary?.recipesByInputMap?.has(key)) return true;
                if (
                    abstractFilterItemType &&
                    this._direction <= 0 &&
                    recipeDictionary?.hasInputTypes?.has(abstractFilterItemType)
                )
                    return true;
                if (
                    relativeAbsractItem &&
                    this._direction <= 0 &&
                    recipeDictionary?.recipesByInputMap?.has(relativeAbsractItem.name)
                )
                    return true;
                if (this._direction >= 0 && recipeDictionary?.recipesByOutputMap?.has(key)) return true;
                if (
                    abstractFilterItemType &&
                    this._direction >= 0 &&
                    recipeDictionary?.hasOutputTypes?.has(abstractFilterItemType)
                )
                    return true;
                if (
                    relativeAbsractItem &&
                    this._direction >= 0 &&
                    recipeDictionary?.recipesByOutputMap?.has(relativeAbsractItem.name)
                )
                    return true;
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

export const FilterStoreContext = createContext(null as FilterStoreBase | null);
export function useFilterStoreBase() {
    const filterStore = useContext(FilterStoreContext);
    if (!filterStore) {
        throw new Error('FilterStoreContext was not found');
    }
    return filterStore;
}
