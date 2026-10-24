<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import type { ConnectionLineProps } from '@vue-flow/core';
import { getBezierPath } from '@vue-flow/core';
import { computed } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import { ConnectionMode, useFlowConnectionState } from '#core/stores/FlowConnectionState.js';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ConnectionLineProps>();

const flowChartModel = useFlowChartModelBase();
const flowConnectionState = useFlowConnectionState();
const data = computed(() => flowChartModel.findIo(props.sourceHandle?.nodeId ?? '', props.sourceHandle?.id ?? ''));
const isDragging = computed(() => flowConnectionState.connectionMode === ConnectionMode.Drag);

function isValid(n: null | number | undefined) {
    if (n === null || n === undefined) return false;
    if (Number.isNaN(n) || !Number.isFinite(n)) return false;
    return true;
}
const edgePath = computed(() => {
    if (!isValid(props.sourceX) || !isValid(props.sourceY) || !isValid(props.targetX) || !isValid(props.targetY))
        return undefined;
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
    <g v-if="data && isDragging && edgePath">
        <path
            :class="
                css({
                    stroke: 'text',
                    strokeWidth: 'var(--game-icon-size-quarter)',
                    fill: 'none',
                })
            "
            :d="edgePath"
        />
        <circle :cx="props.targetX" :cy="props.targetY" fill="#fff" :r="4" stroke="#6F3381" :stroke-width="1.5" />
    </g>
</template>
