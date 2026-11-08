<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import { hstack } from '@daxfb/styles/patterns';
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue';
import { computed } from 'vue';

import type { FactoryModelBase } from '#core/game/model/index.js';
import { formatNumber } from '#core/utils/format.js';

const props = defineProps<{ item: FactoryModelBase }>();

const directionIcon = computed(() => (props.item.isFlipped ? PhArrowLeft : PhArrowRight));
</script>

<template>
    <div
        :class="
            cx(
                hstack({ alignItems: 'center', width: 'full', paddingInline: '1', gap: '1' }),
                css({
                    fontSize: 'sm',
                    lineHeight: 'tight',
                    whiteSpace: 'nowrap',
                    color: 'text.muted',
                    borderTop: '[1px solid {colors.content.border}]',
                    backgroundColor: 'content.hoverBackground',
                })
            )
        "
    >
        <span :class="css({ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis' })">
            <template v-if="props.item.solvedCount !== undefined">
                {{ `${props.item.count ? formatNumber((props.item.solvedCount * 100) / props.item.count) : '0'}%` }}
                {{ `${formatNumber(props.item.solvedCount)} / ` }}
            </template>
            {{ formatNumber(props.item.count) }}
        </span>
        <div :class="hstack({ alignItems: 'center', gap: '1', flexShrink: '0' })">
            <component :is="directionIcon" :class="css({ flexShrink: 0 })" />
        </div>
    </div>
</template>
