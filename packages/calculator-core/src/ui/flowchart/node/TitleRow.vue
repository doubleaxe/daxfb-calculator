<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import { hstack } from '@daxfb/styles/patterns';
import { PhList } from '@phosphor-icons/vue';
import Button from 'primevue/button';

import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';
import { NodeDragHandleClass } from '#core/types/flowchart/node/types.js';

const { data, dragging } = defineProps<{ dragging?: boolean } & FactoryNodeProps>();
</script>

<template>
    <div
        :class="
            cx(
                hstack({ gap: '1', paddingLeft: '1', paddingRight: '1' }),
                css({
                    'fontSize': 'sm',
                    'lineHeight': 'tight',
                    'height': '7',
                    'color': 'white',
                    '_light': {
                        background: '[linear-gradient(135deg, {colors.sky.600} 0%, {colors.sky.700} 100%)]',
                    },
                    '_dark': {
                        background: '[linear-gradient(135deg, {colors.blue.800} 0%, {colors.blue.900} 100%)]',
                    },
                    '&:has([data-hoverable]:hover)': {
                        _light: {
                            background: '[linear-gradient(135deg, {colors.sky.500} 0%, {colors.sky.600} 100%)]',
                        },
                        _dark: {
                            background: '[linear-gradient(135deg, {colors.blue.600} 0%, {colors.blue.700} 100%)]',
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
                        'flex': '1',
                        'minWidth': '0',
                        'width': '0',
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
            <Button
                :class="css({ padding: '0' })"
                severity="secondary"
                size="small"
                variant="outlined"
                aria-label="Menu"
            >
                <PhList />
            </Button>
        </div>
    </div>
</template>
