<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { computed } from 'vue';

import type { GameItemBase } from '#core/game/parser/index.js';

import GameIconDragging from '../components/GameIconDragging.vue';

const {
    x,
    y,
    visible = false,
    item = undefined,
} = defineProps<{
    item?: GameItemBase;
    visible?: boolean;
    x: number;
    y: number;
}>();

const positionStyle = computed(() => ({
    '--indicator-x': `${x}px`,
    '--indicator-y': `${y}px`,
}));
</script>

<template>
    <div
        v-if="visible"
        :class="
            css({
                position: 'absolute',
                top: '0px',
                left: '0px',
                pointerEvents: 'none',
                transform: 'translate(var(--indicator-x), var(--indicator-y))',
            })
        "
        :style="positionStyle"
    >
        <GameIconDragging :item="item" />
    </div>
</template>
