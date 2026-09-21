import type { InterfaceOf } from '@doubleaxe/daxfb-shared/types/UtilityTypes';
import { createInjectionState } from '@vueuse/core';
import { reactive } from 'vue';

import type { GameItemBase } from '#core/game/parser/index.js';

export class FactoryPaletteStateImpl {
    factoryPaletteOpened = true;
    itemSearchOpened = false;
    selectedFactory: GameItemBase | undefined;

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

const [useProvideFactoryPaletteState, _useFactoryPaletteState] = createInjectionState(
    (factoryPaletteState: FactoryPaletteState): FactoryPaletteState => reactive(factoryPaletteState)
);

export { useProvideFactoryPaletteState };
export function useFactoryPaletteState() {
    const factoryPaletteState = _useFactoryPaletteState();
    if (!factoryPaletteState) {
        throw new Error('FactoryPaletteState is not provided');
    }
    return factoryPaletteState;
}
