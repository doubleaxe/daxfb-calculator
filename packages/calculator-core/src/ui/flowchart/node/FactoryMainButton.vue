<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import { Handle, Position, useVueFlow } from '@vue-flow/core';
import { computed, watch } from 'vue';

import { NodeStatus } from '#core/game/model/index.js';
import { useFlowConnectionState } from '#core/stores/FlowConnectionState.js';
import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';
import GameIcon from '#core/ui/components/GameIcon.vue';

import ConnectionMarkerForFactory from './ConnectionMarkerForFactory.vue';

const { data } = defineProps<FactoryNodeProps>();

const flowConnectionState = useFlowConnectionState();
const { updateNodeInternals } = useVueFlow();

const edgePosition = computed(() => {
    const origin = flowConnectionState.origin;
    if (!origin) return Position.Top;
    const isLeft = data.isFlipped ? origin.isInput : !origin.isInput;
    return isLeft ? Position.Left : Position.Right;
});

const showHandle = computed(() => data.status === NodeStatus.PossibleDest && !!flowConnectionState.origin);
const handleType = computed(() => (flowConnectionState.origin?.isInput ? 'source' : 'target'));

watch(
    () => data.status,
    () => {
        updateNodeInternals([data.itemId]);
    },
    { flush: 'post' }
);
</script>

<template>
    <button
        class="group"
        :class="
            css({
                position: 'relative',
                padding: 'var(--central-padding)',
                width: 'var(--game-icon-size)',
                height: 'var(--game-icon-size)',
                border: '[var(--central-border) solid]',
                boxSizing: 'content-box',
                cursor: 'pointer',
                transition: '[all 0.2s ease]',
                _hover: {
                    transform: 'scale(1.1)',
                },
                _light: {
                    backgroundColor: 'surface.100',
                    borderColor: 'sky.600',
                },
                _dark: {
                    backgroundColor: 'surface.800',
                    borderColor: 'sky.700',
                },
            })
        "
        type="button"
        data-hoverable
        :data-item="data.key"
    >
        <GameIcon :image="data.image" />
        <ConnectionMarkerForFactory :status="data.status" />
        <Handle
            v-if="showHandle"
            :id="data.itemId"
            :class="
                css({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    transform: 'none',
                    minWidth: 'auto',
                    minHeight: 'auto',
                    width: 'full',
                    height: 'full',
                    borderRadius: '[0]',
                    border: '[0px transparent]',
                    backgroundColor: 'transparent',
                    zIndex: 1000,
                    cursor: 'grab',
                })
            "
            connectable-end
            :connectable-start="false"
            :position="edgePosition"
            :type="handleType"
        />
    </button>
</template>
