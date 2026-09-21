<script setup lang="ts">
import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import { useVueFlow } from '@vue-flow/core';
import { computed, watch } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import { draggableSelectableStyles } from '#core/styles/DraggableSelectable.js';
import { draggingStyle } from '#core/styles/Dragging.js';

import FactorySurface from './FactorySurface.vue';
import TitleRow from './TitleRow.vue';

const { id, dragging } = defineProps<{
    dragging?: boolean;
    id: string;
}>();

defineOptions({ inheritAttrs: false });

const flowChartModel = useFlowChartModelBase();
const data = computed(() => flowChartModel.itemByKey(id));
const { updateNodeInternals } = useVueFlow();

watch(
    () => data.value?.isFlipped,
    () => {
        if (data.value) updateNodeInternals(data.value.itemId);
    },
    { flush: 'post' }
);
</script>

<template>
    <div
        v-if="data"
        :class="
            cx(
                css({
                    cursor: 'auto',
                    borderRadius: 'sm',
                    _light: {
                        borderColor: 'var(--p-surface-300)',
                        background: 'linear-gradient(135deg, var(--p-surface-0) 0%, var(--p-surface-200) 100%)',
                    },
                    _dark: {
                        borderColor: 'var(--p-surface-600)',
                        background: 'linear-gradient(135deg, var(--p-surface-900) 0%, var(--p-surface-700) 100%)',
                    },
                }),
                draggableSelectableStyles({ hover: 'child', transition: 'none' }),
                draggingStyle
            )
        "
        :data-dragging="dragging || undefined"
    >
        <TitleRow :data="data" :dragging="dragging" />
        <FactorySurface :data="data" />
    </div>
</template>
