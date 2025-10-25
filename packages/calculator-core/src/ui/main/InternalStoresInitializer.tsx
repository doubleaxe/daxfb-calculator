import type { FlowChartModelBase } from '#core/game/model';
import { FlowChartModelContext } from '#core/game/model';
import { useGameDataBase } from '#core/game/parser';
import { FactoryPaletteStateContext, FactoryPaletteStateImpl } from '#core/stores/FactoryPaletteState';
import type { FilterStoreBase } from '#core/stores/FilterStoreBase';
import { FilterStoreBaseImpl, FilterStoreContext } from '#core/stores/FilterStoreBase';
import type { BaseProps } from '#core/types/props';
import { createUniversalProvider } from '#core/utils/hooks';

type Props = {
    flowChartModel: () => FlowChartModelBase;
    store?: () => FilterStoreBase;
} & BaseProps;

export default function InternalStoresInitializer({ children, store, flowChartModel }: Props) {
    const gameData = useGameDataBase();
    const FilterStoreContextProvider = createUniversalProvider(
        FilterStoreContext,
        store ?? (() => new FilterStoreBaseImpl(gameData))
    );
    const FactoryPaletteStateContextProvider = createUniversalProvider(
        FactoryPaletteStateContext,
        () => new FactoryPaletteStateImpl()
    );
    const FlowChartModelContextProvider = createUniversalProvider(FlowChartModelContext, flowChartModel);
    return (
        <FilterStoreContextProvider>
            <FactoryPaletteStateContextProvider>
                <FlowChartModelContextProvider>{children}</FlowChartModelContextProvider>
            </FactoryPaletteStateContextProvider>
        </FilterStoreContextProvider>
    );
}
