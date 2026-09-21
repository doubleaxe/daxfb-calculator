<script setup lang="ts">
import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import { PhArrowFatLinesDown, PhWrench } from '@phosphor-icons/vue';
import { Handle, Position, useVueFlow } from '@vue-flow/core';
import type { Component } from 'vue';
import { computed, watch } from 'vue';

import { NodeStatus } from '#core/game/model/index.js';
import { useFlowConnectionState } from '#core/stores/FlowConnectionState.js';
import { actionIconIndicatorStyle } from '#core/styles/ActionIconIndicator.js';
import { StatusIconColor } from '#core/styles/StatusIcons.js';
import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';
import GameIcon from '#core/ui/components/GameIcon.vue';

const { data } = defineProps<FactoryNodeProps>();

const flowConnectionState = useFlowConnectionState();
const { updateNodeInternals } = useVueFlow();

const markerConfig = computed(() =>
    data.status === NodeStatus.PossibleDest
        ? {
              icon: PhArrowFatLinesDown as Component,
              color: StatusIconColor({ color: NodeStatus.PossibleDest }),
          }
        : undefined
);

watch(
    () => data.status,
    () => {
        updateNodeInternals(data.itemId);
    },
    { flush: 'post' }
);

const edgePosition = computed(() => {
    const origin = flowConnectionState.origin;
    if (!origin) return Position.Top;
    const isLeft = data.isFlipped ? origin.isInput : !origin.isInput;
    return isLeft ? Position.Left : Position.Right;
});

const showHandle = computed(() => data.status === NodeStatus.PossibleDest && !!flowConnectionState.origin);
const handleType = computed(() => (flowConnectionState.origin?.isInput ? 'source' : 'target'));
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
                border: 'var(--central-border) solid',
                borderColor: 'var(--p-primary-color)',
                boxSizing: 'content-box',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                _hover: {
                    transform: 'scale(1.1)',
                },
                _light: {
                    backgroundColor: 'var(--p-surface-100)',
                },
                _dark: {
                    backgroundColor: 'var(--p-surface-800)',
                },
            })
        "
        type="button"
    >
        <GameIcon :image="data.image" />
        <component
            :is="markerConfig.icon"
            v-if="markerConfig"
            :class="
                cx(
                    css({
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        background: 'var(--p-content-background)',
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
                    top: '0px',
                    left: '0px',
                    width: 'var(--action-icon-size)',
                    height: 'var(--action-icon-size)',
                    color: 'var(--p-text-color)',
                    border: '1px solid var(--p-text-color)',
                    _light: {
                        backgroundColor: 'color-mix(in srgb, var(--p-blue-100) 70%, transparent)',
                    },
                    _dark: {
                        backgroundColor: 'color-mix(in srgb, var(--p-blue-900) 70%, transparent)',
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
        <Handle
            v-if="showHandle"
            :id="data.itemId"
            :class="
                css({
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    transform: 'none',
                    minWidth: 'auto',
                    minHeight: 'auto',
                    width: '100%',
                    height: '100%',
                    borderRadius: 0,
                    border: '0px transparent',
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
