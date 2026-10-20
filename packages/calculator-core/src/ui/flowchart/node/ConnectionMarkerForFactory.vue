<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import { PhWrench } from '@phosphor-icons/vue';
import { computed } from 'vue';

import type { NodeStatus } from '#core/game/model/index.js';
import { actionIconIndicatorStyle } from '#core/styles/ActionIconIndicator.js';

import { NodeStatusConfig } from './StatusConfig.js';

const { status } = defineProps<{
    status: NodeStatus;
}>();

const markerConfig = computed(() => NodeStatusConfig[status]);
</script>

<template>
    <component
        :is="markerConfig.icon"
        v-if="markerConfig"
        :class="
            cx(
                css({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    background: 'content.background',
                    opacity: 0.5,
                }),
                css(actionIconIndicatorStyle),
                markerConfig.color
            )
        "
        weight="bold"
    />
    <div
        v-else
        :class="
            css({
                display: 'none',
                position: 'absolute',
                top: '0',
                left: '0',
                width: 'var(--action-icon-size)',
                height: 'var(--action-icon-size)',
                color: 'text',
                borderColor: 'text',
                borderWidth: '1px',
                borderStyle: 'solid',
                _light: {
                    backgroundColor: 'blue.100/70',
                },
                _dark: {
                    backgroundColor: 'blue.900/70',
                },
                _groupHover: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            })
        "
    >
        <PhWrench size="100%" />
    </div>
</template>
