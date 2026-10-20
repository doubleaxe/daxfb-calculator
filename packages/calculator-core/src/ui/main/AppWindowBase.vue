<script setup lang="ts">
import { cva } from '@daxfb/styles/css';
import { hstack, stack, vstack } from '@daxfb/styles/patterns';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

const factoryPaletteState = useFactoryPaletteState();

const scrollBar = cva({
    base: {
        flex: '[1 1 0%]',
        minHeight: '0',
        overflowX: 'hidden',
        scrollbarGutter: 'stable',
    },
    variants: {
        scrollable: {
            yes: {
                'overflowY': 'auto',
                'scrollbarWidth': 'thin',
                '&::-webkit-scrollbar': { display: 'block', width: '1.5' },
            },
            no: {
                'overflowY': 'hidden',
                'scrollbarWidth': 'none',
                '&::-webkit-scrollbar': { display: 'none', width: '0' },
            },
        },
    },
});
</script>

<template>
    <div
        :class="
            vstack({
                alignItems: 'stretch',
                width: 'full',
                height: 'full',
                overflow: 'hidden',
            })
        "
    >
        <header
            :class="
                hstack({
                    height: '[60px]',
                    flexShrink: 0,
                    paddingInline: '1',
                    borderBottom: '[1px solid {colors.content.border}]',
                })
            "
        >
            <slot name="toolbar" />
        </header>

        <div
            :class="
                hstack({
                    alignItems: 'stretch',
                    flex: '[1 1 0%]',
                    minWidth: '0',
                    overflow: 'hidden',
                })
            "
        >
            <aside
                v-if="factoryPaletteState.factoryPaletteOpened"
                :class="
                    vstack({
                        alignItems: 'stretch',
                        width: { base: '48', sm: '48', lg: '64' },
                        flexShrink: 0,
                        overflow: 'hidden',
                        borderRight: '[1px solid {colors.content.border}]',
                        paddingTop: '1',
                    })
                "
            >
                <!-- insert filter panel here if you want it sticky -->
                <slot name="filterPanel" />
                <div :class="scrollBar({ scrollable: factoryPaletteState.itemSearchOpened ? 'no' : 'yes' })">
                    <slot name="factoryPalette" />
                </div>
            </aside>

            <main
                :class="
                    stack({
                        flex: '[1 1 0%]',
                        minWidth: '0',
                        minHeight: '0',
                        overflow: 'hidden',
                        alignItems: 'stretch',
                        justifyContent: 'stretch',
                    })
                "
            >
                <slot name="flowChart" />
            </main>
        </div>
    </div>
</template>
