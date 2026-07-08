<script setup lang="ts">
import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';

import type { GameItemBase } from '#core/game/parser/index.js';
import { draggingStyle } from '#core/styles/Dragging.js';

import GameIcon from './GameIcon.vue';

const { item } = defineProps<{
    item: GameItemBase | undefined;
}>();
</script>

<template>
    <div
        :class="
            cx(
                css({ backgroundColor: 'var(--mantine-color-body)', borderRadius: 'var(--mantine-radius-md)' }),
                draggingStyle
            )
        "
        data-dragging
    >
        <GameIcon v-if="item" :image="item?.image" />
    </div>
</template>
