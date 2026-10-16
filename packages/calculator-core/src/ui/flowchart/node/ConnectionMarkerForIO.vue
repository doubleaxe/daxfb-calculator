<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import { computed } from 'vue';

import type { EdgeStatus } from '#core/game/model/index.js';
import { actionIconIndicatorStyle } from '#core/styles/ActionIconIndicator.js';

import { EdgeStatusConfig } from './StatusConfig.js';

const { status } = defineProps<{
    status: EdgeStatus;
}>();

const markerConfig = computed(() => EdgeStatusConfig[status]);
</script>

<template>
    <component
        :is="markerConfig.icon"
        v-if="markerConfig"
        :class="cx(css(actionIconIndicatorStyle), markerConfig.color)"
        weight="bold"
    />
</template>
