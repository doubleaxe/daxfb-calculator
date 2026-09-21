<script setup lang="ts">
import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import { stack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { Handle, Position } from '@vue-flow/core';
import { computed } from 'vue';

import { EdgeStatus, type RecipeIOModelBase } from '#core/game/model/index.js';
import { draggableSelectableStyles } from '#core/styles/DraggableSelectable.js';
import GameIcon from '#core/ui/components/GameIcon.vue';

import IOConnectionMarker from './IOConnectionMarker.vue';

const { io } = defineProps<{
    io: RecipeIOModelBase;
}>();

const isLtr = computed(() => (io.isFlipped ? !io.isInput : io.isInput));
const edgePosition = computed(() => (isLtr.value ? Position.Left : Position.Right));
</script>

<template>
    <div :class="stack({ alignItems: 'center', direction: isLtr ? 'row' : 'row-reverse' })">
        <div
            :aria-selected="io.status === EdgeStatus.ConnectionOrigin"
            :class="
                cx(
                    css({ position: 'relative', borderRadius: 'lg', borderColor: 'transparent' }),
                    draggableSelectableStyles({ hover: 'cursor', transition: 'lift', select: 'none' })
                )
            "
        >
            <GameIcon :image="io.image" />
            <Handle
                :id="io.itemId"
                :class="
                    css({
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        transform: 'none',
                        minWidth: 'auto',
                        minHeight: 'auto',
                        width: '100%',
                        height: '100%',
                        borderRadius: 0,
                        border: '0px transparent',
                        backgroundColor: 'transparent',
                        cursor: 'grab',
                    })
                "
                connectable-end
                connectable-start
                :position="edgePosition"
                :type="io.isInput ? 'target' : 'source'"
            >
                <IOConnectionMarker :status="io.status" />
            </Handle>
        </div>
        <div
            :class="
                css({
                    paddingLeft: '0.25em',
                    paddingRight: '0.25em',
                    flex: 1,
                    textAlign: isLtr ? 'left' : 'right',
                    fontSize: '0.75rem',
                })
            "
        >
            {{ io.label }}
        </div>
    </div>
</template>
