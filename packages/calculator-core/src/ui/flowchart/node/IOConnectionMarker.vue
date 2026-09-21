<script setup lang="ts">
import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import { PhArrowFatLinesDown, PhArrowFatLinesUp, PhX } from '@phosphor-icons/vue';
import type { Component } from 'vue';
import { computed } from 'vue';

import { EdgeStatus } from '#core/game/model/index.js';
import { actionIconIndicatorStyle } from '#core/styles/ActionIconIndicator.js';
import { StatusIconColor } from '#core/styles/StatusIcons.js';

const { status } = defineProps<{
    status: EdgeStatus;
}>();

const config = computed(() => {
    switch (status) {
        case EdgeStatus.ConnectedDest:
            return {
                icon: PhX as Component,
                color: StatusIconColor({ color: EdgeStatus.ConnectedDest }),
            };
        case EdgeStatus.ConnectionDest:
            return {
                icon: PhArrowFatLinesDown as Component,
                color: StatusIconColor({ color: EdgeStatus.ConnectionDest }),
            };
        case EdgeStatus.ConnectionOrigin:
            return {
                icon: PhArrowFatLinesUp as Component,
                color: StatusIconColor({ color: EdgeStatus.ConnectionOrigin }),
            };
        default:
            return undefined;
    }
});
</script>

<template>
    <component :is="config.icon" v-if="config" :class="cx(css(actionIconIndicatorStyle), config.color)" weight="bold" />
</template>
