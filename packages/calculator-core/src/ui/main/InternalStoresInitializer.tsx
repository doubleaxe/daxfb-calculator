import { useGameDataBase } from '#core/game/parser';
import { FactoryPaletteStateContext, FactoryPaletteStateImpl } from '#core/stores/FactoryPaletteState';
import type { FilterStoreBase } from '#core/stores/FilterStoreBase';
import { FilterStoreBaseImpl, FilterStoreContext } from '#core/stores/FilterStoreBase';
import type { BaseProps } from '#core/types/props';
import { createUniversalProvider } from '#core/utils/hooks';

type Props = {
    store?: FilterStoreBase;
} & BaseProps;

export default function InternalStoresInitializer({ children, store }: Props) {
    const gameData = useGameDataBase();
    const FilterStoreContextProvider = createUniversalProvider(
        FilterStoreContext,
        () => store ?? new FilterStoreBaseImpl(gameData)
    );
    const FactoryPaletteStateContextProvider = createUniversalProvider(
        FactoryPaletteStateContext,
        () => new FactoryPaletteStateImpl()
    );
    return (
        <FilterStoreContextProvider>
            <FactoryPaletteStateContextProvider>{children}</FactoryPaletteStateContextProvider>
        </FilterStoreContextProvider>
    );
}
