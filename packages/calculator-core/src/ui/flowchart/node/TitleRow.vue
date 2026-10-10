<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import { hstack } from '@daxfb/styles/patterns';
import { PhList } from '@phosphor-icons/vue';

import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';
import { NodeDragHandleClass } from '#core/types/flowchart/node/types.js';
import ActionButton from '#core/ui/components/ActionButton.vue';

const { data, dragging } = defineProps<{ dragging?: boolean } & FactoryNodeProps>();
</script>

<template>
    <div
        :class="
            cx(
                hstack({ gap: '0.25em', paddingLeft: '0.25em', paddingRight: '0.25em' }),
                css({
                    'fontSize': '0.875rem',
                    'lineHeight': '1.25',
                    'height': '1.7rem',
                    'color': 'primary.contrast',
                    '_light': {
                        background: 'linear-gradient(135deg, {colors.blue.700} 0%, {colors.blue.900} 100%)',
                    },
                    '_dark': {
                        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                    },
                    '&:has([data-hoverable]:hover)': {
                        _light: {
                            background: 'linear-gradient(135deg, {colors.blue.500} 0%, {colors.blue.700} 100%)',
                        },
                        _dark: {
                            background: 'linear-gradient(135deg, {colors.indigo.800} 0%, {colors.indigo.900} 100%)',
                        },
                    },
                })
            )
        "
    >
        <div
            :class="
                cx(
                    css({
                        'cursor': 'grab',
                        'flex': 1,
                        'minWidth': 0,
                        'width': 0,
                        'overflow': 'hidden',
                        'textOverflow': 'ellipsis',
                        'whiteSpace': 'nowrap',
                        'userSelect': 'none',
                        '&[data-dragging]': {
                            cursor: 'grabbing!',
                        },
                    }),
                    NodeDragHandleClass
                )
            "
            :data-dragging="dragging ? 'true' : undefined"
            data-hoverable
        >
            {{ data.label }}
        </div>
        <div :class="css({ flex: 'none', whiteSpace: 'nowrap' })">
            <ActionButton :icon="PhList" aria-label="Menu" />
        </div>
    </div>
</template>
