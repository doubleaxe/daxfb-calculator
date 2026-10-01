<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { PhList, PhMoon, PhSun, PhX } from '@phosphor-icons/vue';
import Button from 'primevue/button';

import { useDarkModeStore } from '#core/stores/DarkModeStore.js';
import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

const factoryPaletteState = useFactoryPaletteState();
const isDark = useDarkModeStore();
</script>

<template>
    <div :class="hstack({ alignItems: 'center', paddingInline: '1', flex: '1 1 0%' })">
        <div :class="hstack()">
            <Button
                aria-label="Toggle palette"
                severity="secondary"
                variant="outlined"
                @click="factoryPaletteState.toggleFactoryPalette()"
            >
                <PhX v-if="factoryPaletteState.factoryPaletteOpened" />
                <PhList v-else />
            </Button>
        </div>
        <div :class="hstack({ flex: '1 1 0%' })"></div>
        <div :class="hstack()">
            <Button
                :class="css({ color: isDark ? 'yellow.300' : 'blue.600' })"
                aria-label="Toggle color scheme"
                severity="secondary"
                variant="outlined"
                @click="isDark = !isDark"
            >
                <PhSun v-if="isDark" />
                <PhMoon v-else />
            </Button>
        </div>
    </div>
</template>
