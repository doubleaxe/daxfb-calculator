<script setup lang="ts">
import { css } from '@daxfb/styles/css';

import type { GameItemBase } from '#core/game/parser/index.js';
import { draggingStyle } from '#core/styles/Dragging.js';

import GameIcon from './GameIcon.vue';

const { item } = defineProps<{
    item: GameItemBase | undefined;
}>();
</script>

<template>
    <div :class="css({ ...draggingStyle, backgroundColor: 'content.background', borderRadius: 'lg' })" data-dragging>
        <GameIcon v-if="item" :image="item?.image" />
    </div>
</template>
