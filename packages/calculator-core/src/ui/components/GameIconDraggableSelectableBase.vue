<script setup lang="ts">
import { cva, cx } from '@doubleaxe/daxfb-calculator-styles/css';

import type { GameItemImageJson } from '#core/game/parser/index.js';
import { draggableSelectableStyles } from '#core/styles/DraggableSelectable.js';

import GameIcon from './GameIcon.vue';

type Props = {
    borderStyle?: 'plain';
    elementRef?: (el: HTMLElement | null) => void;
    image: GameItemImageJson | undefined;
    isSelected?: boolean;
};

const { image, isSelected = false, borderStyle = 'plain', elementRef = () => {} } = defineProps<Props>();

const emit = defineEmits<(e: 'click', event: MouseEvent) => void>();

const iconStyles = cva({
    base: {
        borderRadius: 'lg',
    },
    variants: {
        borderStyle: {
            plain: {
                borderColor: 'transparent',
                _light: {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                },
                _dark: {
                    boxShadow: '0 2px 4px rgba(255, 255, 255, 0.2)',
                },
            },
        },
    },
});
</script>

<template>
    <div
        :ref="(el) => elementRef(el as HTMLElement | null)"
        :class="
            cx(
                iconStyles({ borderStyle }),
                draggableSelectableStyles({ hover: 'cursor', transition: 'lift', select: 'data' })
            )
        "
        :data-selected="isSelected ? true : undefined"
        :aria-selected="isSelected ? true : undefined"
        @click="(event) => emit('click', event)"
    >
        <GameIcon :image="image" />
    </div>
</template>
