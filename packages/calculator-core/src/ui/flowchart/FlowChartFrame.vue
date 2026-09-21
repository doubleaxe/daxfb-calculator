<script setup lang="ts">
import './flow.css';

import { useDroppable } from '@dnd-kit/vue';
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { shallowRef } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import { FlowChartDroppable } from '#core/types/flowchart/types.js';

import FlowChart from './FlowChart.vue';

const flowChartModel = useFlowChartModelBase();

const element = shallowRef<HTMLElement | null>(null);
const setElementRef = (el: HTMLElement | null) => {
    element.value = el;
};
useDroppable({ id: FlowChartDroppable, element });

const onClick = (event: MouseEvent) => {
    flowChartModel.events.emit('paneClickAnywhere', event);
};
</script>

<template>
    <div
        :ref="(el) => setElementRef(el as HTMLElement | null)"
        :class="css({ width: '100%', height: '100%' })"
        @click="onClick"
    >
        <FlowChart />
    </div>
</template>
