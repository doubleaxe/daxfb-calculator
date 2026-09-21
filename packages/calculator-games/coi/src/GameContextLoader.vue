<script setup lang="ts">
import MantineInit from '@doubleaxe/daxfb-calculator-core/ui/MantineInit';
import { css } from '@doubleaxe/daxfb-calculator-styles/css';

import GameContextProvider from '#game-ui-coi/game/parser/GameContextProvider.vue';
import PageInitializer from '#game-ui-coi/ui/PageInitializer.vue';
</script>

<template>
    <MantineInit>
        <Suspense>
            <GameContextProvider>
                <PageInitializer />
            </GameContextProvider>
            <template #fallback>
                <div :class="css({ width: '100%', height: '100%' })" />
            </template>
        </Suspense>
    </MantineInit>
</template>
