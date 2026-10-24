<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import { useVueFlow } from '@vue-flow/core';
import { NodeToolbar } from '@vue-flow/node-toolbar';
import { computed, watch } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import { draggableSelectableCva } from '#core/styles/DraggableSelectable.js';
import { draggingStyle } from '#core/styles/Dragging.js';
import type { FactoryNodeInstanceProps } from '#core/types/flowchart/node/types.js';

import FactorySurface from './FactorySurface.vue';
import TitleRow from './TitleRow.vue';

// eslint-disable-next-line vue/no-unused-properties
const { id, dragging } = defineProps<FactoryNodeInstanceProps>();
defineOptions({
    inheritAttrs: false,
});

const flowChartModel = useFlowChartModelBase();
const data = computed(() => flowChartModel.itemByKey(id));
const { updateNodeInternals } = useVueFlow();

watch(
    () => data.value?.isFlipped,
    () => {
        if (data.value) updateNodeInternals([data.value.itemId]);
    },
    { flush: 'post' }
);
</script>

<template>
    <NodeToolbar v-if="false">
        <button type="button">cut</button>
    </NodeToolbar>
    <div
        v-if="data"
        :class="
            cx(
                css({
                    ...draggingStyle,
                    cursor: 'auto',
                    borderRadius: 'sm',
                    _light: {
                        borderColor: 'surface.400',
                        background: '[linear-gradient(135deg, {colors.surface.50} 0%, {colors.surface.300} 100%)]',
                    },
                    _dark: {
                        borderColor: 'surface.400',
                        background: '[linear-gradient(135deg, {colors.surface.800} 0%, {colors.surface.600} 100%)]',
                    },
                }),
                draggableSelectableCva({ hover: 'child', transition: 'none' })
            )
        "
        :data-dragging="dragging || undefined"
    >
        <TitleRow :data="data" :dragging="dragging" />
        <FactorySurface :data="data" />
    </div>
</template>
