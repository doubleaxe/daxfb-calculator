<script setup lang="ts">
import { useDraggable } from '@dnd-kit/vue';
import { shallowRef } from 'vue';

import type { GameItemBase } from '#core/game/parser/index.js';

import GameIconDraggableSelectableBase from '../components/GameIconDraggableSelectableBase.vue';

type Props = {
    borderStyle?: 'plain';
    isSelected?: boolean;
    item: GameItemBase;
};

const { item, isSelected = false, borderStyle = 'plain' } = defineProps<Props>();

const element = shallowRef<HTMLElement | null>(null);
const setElementRef = (el: HTMLElement | null) => {
    element.value = el;
};

useDraggable({
    id: item.key,
    element,
});
</script>

<template>
    <GameIconDraggableSelectableBase
        :element-ref="setElementRef"
        :is-selected="isSelected"
        :border-style="borderStyle"
        :image="item.image"
        :data-item="item.key"
        tabindex="0"
    />
</template>
