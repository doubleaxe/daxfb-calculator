<script setup lang="ts">
import './flow.css';

import { css } from '@daxfb/styles/css';
import { useDroppable } from '@dnd-kit/vue';
import { useTemplateRef } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import { FlowChartDroppable } from '#core/types/flowchart/types.js';

import FlowChart from './FlowChart.vue';

const flowChartModel = useFlowChartModelBase();

const element = useTemplateRef('element');
useDroppable({ id: FlowChartDroppable, element });

function onClick(event: MouseEvent) {
    flowChartModel.events.emit('paneClickAnywhere', event);
}
function onPointerLeave(event: PointerEvent) {
    flowChartModel.events.emit('panePointerLeave', event);
}
function onPointerOver(event: PointerEvent) {
    flowChartModel.events.emit('panePointerOver', event);
}
</script>

<template>
    <div
        ref="element"
        :class="css({ width: 'full', height: 'full' })"
        @click="onClick"
        @pointerleave="onPointerLeave"
        @pointerover="onPointerOver"
    >
        <FlowChart />
    </div>
</template>
