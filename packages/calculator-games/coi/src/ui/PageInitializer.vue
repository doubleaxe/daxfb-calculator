<script setup lang="ts">
import DragAndDropInitializer from '@daxfb/core/ui/main/DragAndDropInitializer.vue';
import useInternalStoresInitializer from '@daxfb/core/utils/main/InternalStoresInitializer.js';
import useStylesInitializer from '@daxfb/core/utils/main/StylesInitializer.js';
import iconsPath from '@daxfb/gamedata-generated/coi/images.png';

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
