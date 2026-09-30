import type { FlowChartModelBase } from '#core/game/model/index.js';
import { useProvideFlowChartModelBase } from '#core/game/model/index.js';
import { type GameDataBase, useGameDataBase } from '#core/game/parser/index.js';
import { FactoryPaletteStateImpl, useProvideFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';
import type { FilterStoreBase } from '#core/stores/FilterStoreBase.js';
import { FilterStoreBaseImpl, useProvideFilterStoreBase } from '#core/stores/FilterStoreBase.js';
import { FlowConnectionStateImpl, useProvideFlowConnectionState } from '#core/stores/FlowConnectionState.js';

export type InternalStoresInitializerOptions = {
    flowChartModel: FlowChartModelBase;
    gameData?: GameDataBase;
    store?: FilterStoreBase;
};

export default function useInternalStoresInitializer(options: InternalStoresInitializerOptions) {
    const gameData = options.gameData ?? useGameDataBase();

    const filterStore = options.store ?? new FilterStoreBaseImpl(gameData);
    useProvideFilterStoreBase(filterStore);

    const factoryPaletteState = new FactoryPaletteStateImpl();
    useProvideFactoryPaletteState(factoryPaletteState);

    const flowChartModel = options.flowChartModel;
    useProvideFlowChartModelBase(flowChartModel);

    const flowConnectionState = new FlowConnectionStateImpl(flowChartModel);
    useProvideFlowConnectionState(flowConnectionState);

    return {
        gameData,
        filterStore,
        factoryPaletteState,
        flowChartModel,
        flowConnectionState,
    };
}
