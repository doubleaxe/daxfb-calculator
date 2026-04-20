import type { FlowChartModelBase } from '#core/game/model/index.js';
import { FlowChartModelContext } from '#core/game/model/index.js';
import { useGameDataBase } from '#core/game/parser/index.js';
import { FactoryPaletteStateContext, FactoryPaletteStateImpl } from '#core/stores/FactoryPaletteState.js';
import type { FilterStoreBase } from '#core/stores/FilterStoreBase.js';
import { FilterStoreBaseImpl, FilterStoreContext } from '#core/stores/FilterStoreBase.js';
import type { BaseProps } from '#core/types/props.js';

import UniversalProvider from '../helpers/UniversalProvider.jsx';

type Props = {
    flowChartModel: () => FlowChartModelBase;
    store?: () => FilterStoreBase;
} & BaseProps;

export default function InternalStoresInitializer({ children, store, flowChartModel }: Props) {
    const gameData = useGameDataBase();
    return (
        <UniversalProvider context={FilterStoreContext} init={store ?? (() => new FilterStoreBaseImpl(gameData))}>
            <UniversalProvider context={FactoryPaletteStateContext} init={() => new FactoryPaletteStateImpl()}>
                <UniversalProvider context={FlowChartModelContext} init={flowChartModel}>
                    {children}
                </UniversalProvider>
            </UniversalProvider>
        </UniversalProvider>
    );
}
