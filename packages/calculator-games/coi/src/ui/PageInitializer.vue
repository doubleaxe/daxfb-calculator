<script setup lang="ts">
import DragAndDropInitializer from '@doubleaxe/daxfb-calculator-core/ui/main/DragAndDropInitializer.vue';
import useInternalStoresInitializer from '@doubleaxe/daxfb-calculator-core/utils/main/InternalStoresInitializer.js';
import useStylesInitializer from '@doubleaxe/daxfb-calculator-core/utils/main/StylesInitializer.js';
import iconsPath from '@doubleaxe/daxfb-gamedata-generated/coi/images.png';

import { flowChartModelCoiFactory } from '#game-ui-coi/game/model/index.js';
import { useGameData } from '#game-ui-coi/game/parser/index.js';

import AppWindow from './AppWindow.vue';

const gameData = useGameData();
useStylesInitializer({ gameData, iconsPath });
useInternalStoresInitializer({
    gameData,
    flowChartModel: flowChartModelCoiFactory(gameData),
});
</script>

<template>
    <DragAndDropInitializer>
        <AppWindow />
    </DragAndDropInitializer>
</template>
