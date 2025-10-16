import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';

import type { GameItemBase } from '#core/game/parser';
import type { InterfaceOf } from '#daxfb-shared/types/UtilityTypes';

export class FactoryPaletteStateImpl {
    itemSearchOpened = false;
    selectedFactory: GameItemBase | undefined;

    constructor() {
        makeObservable(this, {
            itemSearchOpened: observable,
            selectedFactory: observable,
            setItemSearchOpened: action,
            setSelectedFactory: action,
        });
    }

    setItemSearchOpened(itemSearchOpened: boolean) {
        this.itemSearchOpened = itemSearchOpened;
    }
    setSelectedFactory(selectedFactory: GameItemBase | undefined) {
        this.selectedFactory = selectedFactory;
    }
}

export type FactoryPaletteState = InterfaceOf<FactoryPaletteStateImpl>;

export const FactoryPaletteStateContext = createContext(new FactoryPaletteStateImpl());
export function useFactoryPaletteState() {
    const factoryPaletteState = useContext(FactoryPaletteStateContext);
    if (!factoryPaletteState) {
        throw new Error('FactoryPaletteStateContext was not found');
    }
    return factoryPaletteState;
}
