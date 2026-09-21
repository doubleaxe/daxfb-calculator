<script setup lang="ts">
import DragAndDropInitializer from '@doubleaxe/daxfb-calculator-core/ui/main/DragAndDropInitializer';
import InternalStoresInitializer from '@doubleaxe/daxfb-calculator-core/ui/main/InternalStoresInitializer';
import useStylesInitializer from '@doubleaxe/daxfb-calculator-core/utils/main/StylesInitializer';
import iconsPath from '@doubleaxe/daxfb-gamedata-generated/coi/images.png';

import { flowChartModelCoiFactory } from '#game-ui-coi/game/model/index.js';
import { useGameData } from '#game-ui-coi/game/parser/index.js';

import AppWindow from './AppWindow.vue';

const gameData = useGameData();
useStylesInitializer({ gameData, iconsPath });
</script>

<template>
    <DragAndDropInitializer>
        <InternalStoresInitializer :flow-chart-model="() => flowChartModelCoiFactory(gameData)">
            <AppWindow />
        </InternalStoresInitializer>
    </DragAndDropInitializer>
</template>
