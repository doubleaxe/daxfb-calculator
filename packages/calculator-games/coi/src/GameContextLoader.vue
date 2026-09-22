<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';

import GameContextProvider from '#game-ui-coi/game/parser/GameContextProvider.vue';
import PageInitializer from '#game-ui-coi/ui/PageInitializer.vue';
</script>

<template>
    <Suspense>
        <GameContextProvider>
            <PageInitializer />
        </GameContextProvider>
        <template #fallback>
            <div :class="css({ width: '100%', height: '100%' })" />
        </template>
    </Suspense>
</template>
