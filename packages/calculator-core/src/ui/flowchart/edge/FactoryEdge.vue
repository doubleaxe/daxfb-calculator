<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import type { Position } from '@vue-flow/core';
import { BaseEdge, getBezierPath } from '@vue-flow/core';
import { computed } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';

const props = defineProps<{
    id: string;
    sourcePosition: Position;
    sourceX: number;
    sourceY: number;
    targetPosition: Position;
    targetX: number;
    targetY: number;
}>();

defineOptions({ inheritAttrs: false });

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
                stroke: 'var(--p-text-color)',
                strokeWidth: 'var(--game-icon-size-quarter)',
                fill: 'none',
            })
        "
        :path="edgePath"
    />
</template>
