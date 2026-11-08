<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import { Handle, Position, useVueFlow } from '@vue-flow/core';
import { computed, useTemplateRef, watch } from 'vue';

import { NodeStatus } from '#core/game/model/index.js';
import { useFlowConnectionState } from '#core/stores/FlowConnectionState.js';
import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';
import GameIcon from '#core/ui/components/GameIcon.vue';

import ConnectionMarkerForFactory from './ConnectionMarkerForFactory.vue';
import RecipeMenuList from './RecipeMenuList.vue';

const { data } = defineProps<FactoryNodeProps>();

const hasRecipeMenu = computed(() => data.recipes.length > 1);

const recipeMenu = useTemplateRef<{ toggle: (event: Event) => void } | null>('recipeMenu');

function toggle(event: Event) {
    if (!hasRecipeMenu.value) return;
    recipeMenu.value?.toggle(event);
}

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
    <div :class="css({ display: 'flex' })">
        <button
            class="group"
            :class="
                cx(
                    css({
                        position: 'relative',
                        padding: 'var(--central-padding)',
                        width: 'var(--game-icon-size)',
                        height: 'var(--game-icon-size)',
                        border: '[var(--central-border) solid]',
                        boxSizing: 'content-box',
                        transition: '[all 0.2s ease]',
                        _light: {
                            backgroundColor: 'surface.100',
                            borderColor: 'sky.600',
                        },
                        _dark: {
                            backgroundColor: 'surface.800',
                            borderColor: 'sky.700',
                        },
                    }),
                    hasRecipeMenu
                        ? css({
                              cursor: 'pointer',
                              _hover: {
                                  transform: 'scale(1.1)',
                              },
                          })
                        : css({ cursor: 'auto' })
                )
            "
            type="button"
            :data-hoverable="hasRecipeMenu ? true : undefined"
            :data-item="data.key"
            @click="toggle"
        >
            <GameIcon :image="data.image" />
            <ConnectionMarkerForFactory :status="data.status" :show-wrench="hasRecipeMenu" />
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
        <RecipeMenuList v-if="hasRecipeMenu" ref="recipeMenu" :data="data" />
    </div>
</template>
