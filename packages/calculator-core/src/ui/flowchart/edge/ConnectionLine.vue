<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import type { ConnectionLineProps } from '@vue-flow/core';
import { getBezierPath } from '@vue-flow/core';
import { computed } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ConnectionLineProps>();

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
