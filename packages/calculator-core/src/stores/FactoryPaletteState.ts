import type { InterfaceOf } from '@doubleaxe/daxfb-shared/types/UtilityTypes';
import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';

import type { GameItemBase } from '#core/game/parser/index.js';

export class FactoryPaletteStateImpl {
    factoryPaletteOpened = true;
    itemSearchOpened = false;
    selectedFactory: GameItemBase | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    toggleFactoryPalette() {
        this.factoryPaletteOpened = !this.factoryPaletteOpened;
    }
    setItemSearchOpened(itemSearchOpened: boolean) {
        this.itemSearchOpened = itemSearchOpened;
    }
    setSelectedFactory(selectedFactory: GameItemBase | undefined) {
        this.selectedFactory = selectedFactory;
    }
}

export type FactoryPaletteState = InterfaceOf<FactoryPaletteStateImpl>;

export const FactoryPaletteStateContext = createContext(null as FactoryPaletteState | null);
export function useFactoryPaletteState() {
    const factoryPaletteState = useContext(FactoryPaletteStateContext);
    if (!factoryPaletteState) {
        throw new Error('FactoryPaletteStateContext was not found');
    }
    return factoryPaletteState;
}
