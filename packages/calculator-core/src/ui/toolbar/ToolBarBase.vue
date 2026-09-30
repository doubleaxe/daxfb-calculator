<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { PhList, PhMoon, PhSun, PhX } from '@phosphor-icons/vue';

import { useDarkModeStore } from '#core/stores/DarkModeStore.js';
import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

import ActionButton from '../components/ActionButton.vue';

const factoryPaletteState = useFactoryPaletteState();
const isDark = useDarkModeStore();
</script>

<template>
    <div :class="hstack({ alignItems: 'center', justify: 'space-between' })">
        <div :class="hstack()">
            <ActionButton aria-label="Toggle palette" @click="factoryPaletteState.toggleFactoryPalette()">
                <PhX v-if="factoryPaletteState.factoryPaletteOpened" />
                <PhList v-else />
            </ActionButton>
        </div>
        <div :class="hstack()">
            <ActionButton
                :class="css({ color: isDark ? 'yellow.300' : 'blue.600' })"
                aria-label="Toggle color scheme"
                @click="isDark = !isDark"
            >
                <PhSun v-if="isDark" />
                <PhMoon v-else />
            </ActionButton>
        </div>
    </div>
</template>
