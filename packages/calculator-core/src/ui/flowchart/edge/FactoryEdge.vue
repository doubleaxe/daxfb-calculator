<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import { BaseEdge, getBezierPath } from '@vue-flow/core';
import { computed } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import type { FactoryEdgeInstanceProps } from '#core/types/flowchart/edge/types.js';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<FactoryEdgeInstanceProps>();
defineOptions({
    inheritAttrs: false,
});

const flowChartModel = useFlowChartModelBase();
const data = computed(() => flowChartModel.linkByKey(props.id));

const edgePath = computed(() => {
    const [path] = getBezierPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: props.sourcePosition,
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: props.targetPosition,
    });
    return path;
});
</script>

<template>
    <BaseEdge
        v-if="data"
        :class="
            css({
                stroke: 'text',
                strokeWidth: 'var(--game-icon-size-quarter)',
                fill: 'none',
            })
        "
        :path="edgePath"
    />
</template>
