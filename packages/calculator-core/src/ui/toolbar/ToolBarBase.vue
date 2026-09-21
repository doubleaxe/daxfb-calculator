<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { PhList, PhMoon, PhSun, PhX } from '@phosphor-icons/vue';
import { useDark, useToggle } from '@vueuse/core';
import type { Component } from 'vue';
import { computed } from 'vue';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

import ActionButton from '../components/ActionButton.vue';

const factoryPaletteState = useFactoryPaletteState();
const isDark = useDark();
const toggleDark = useToggle(isDark);

const paletteIcon = computed<Component>(() => (factoryPaletteState.factoryPaletteOpened ? PhX : PhList) as Component);
const schemeIcon = computed<Component>(() => (isDark.value ? PhSun : PhMoon) as Component);
</script>

<template>
    <div :class="hstack({ alignItems: 'center', justify: 'space-between' })">
        <div :class="hstack()">
            <ActionButton
                :icon="paletteIcon"
                title="Toggle palette"
                @click="factoryPaletteState.toggleFactoryPalette()"
            />
        </div>
        <div :class="hstack()">
            <ActionButton
                :class="css({ color: isDark ? 'var(--p-yellow-300)' : 'var(--p-blue-600)' })"
                :icon="schemeIcon"
                title="Toggle color scheme"
                @click="toggleDark()"
            />
        </div>
    </div>
</template>
