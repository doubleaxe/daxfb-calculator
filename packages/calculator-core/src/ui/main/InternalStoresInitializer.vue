<script setup lang="ts">
import { reactive } from 'vue';

import type { FlowChartModelBase } from '#core/game/model/index.js';
import { useProvideFlowChartModelBase } from '#core/game/model/index.js';
import { useGameDataBase } from '#core/game/parser/index.js';
import { FactoryPaletteStateImpl, useProvideFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';
import type { FilterStoreBase } from '#core/stores/FilterStoreBase.js';
import { FilterStoreBaseImpl, useProvideFilterStoreBase } from '#core/stores/FilterStoreBase.js';
import { FlowConnectionStateImpl, useProvideFlowConnectionState } from '#core/stores/FlowConnectionState.js';

const props = defineProps<{
    flowChartModel: () => FlowChartModelBase;
    store?: () => FilterStoreBase;
}>();

const gameData = useGameDataBase();

useProvideFilterStoreBase((props.store ?? (() => new FilterStoreBaseImpl(gameData)))());
useProvideFactoryPaletteState(new FactoryPaletteStateImpl());

const flowChartModel = reactive(props.flowChartModel());
useProvideFlowChartModelBase(flowChartModel);
useProvideFlowConnectionState(new FlowConnectionStateImpl(flowChartModel));
</script>

<template>
    <slot />
</template>
