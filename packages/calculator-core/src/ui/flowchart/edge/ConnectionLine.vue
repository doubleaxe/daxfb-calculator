<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import type { HandleElement, Position } from '@vue-flow/core';
import { getBezierPath } from '@vue-flow/core';
import { computed } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';

const props = defineProps<{
    sourceHandle: HandleElement | null;
    sourcePosition: Position;
    sourceX: number;
    sourceY: number;
    targetPosition: Position;
    targetX: number;
    targetY: number;
}>();

defineOptions({ inheritAttrs: false });

const flowChartModel = useFlowChartModelBase();
const data = computed(() => flowChartModel.findIo(props.sourceHandle?.nodeId ?? '', props.sourceHandle?.id ?? ''));

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
    <g v-if="data">
        <path
            :class="
                css({
                    stroke: 'var(--p-text-color)',
                    strokeWidth: 'var(--game-icon-size-quarter)',
                    fill: 'none',
                })
            "
            :d="edgePath"
        />
    </g>
</template>
