<script setup lang="ts">
import { cva } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack, stack, vstack } from '@doubleaxe/daxfb-calculator-styles/patterns';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

const factoryPaletteState = useFactoryPaletteState();

const scrollBar = cva({
    base: {
        flex: '1 1 0%',
        minHeight: 0,
        overflowX: 'hidden',
        scrollbarGutter: 'stable',
    },
    variants: {
        scrollable: {
            yes: {
                'overflowY': 'auto',
                'scrollbarWidth': 'thin',
                '&::-webkit-scrollbar': { display: 'block', width: '6px' },
            },
            no: {
                'overflowY': 'hidden',
                'scrollbarWidth': 'none',
                '&::-webkit-scrollbar': { display: 'none', width: '0px' },
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
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            })
        "
    >
        <header
            :class="
                hstack({
                    height: '60px',
                    flexShrink: 0,
                    paddingInline: 'md',
                })
            "
        >
            <slot name="toolbar" />
        </header>

        <div
            :class="
                hstack({
                    alignItems: 'stretch',
                    flex: '1 1 0%',
                    minWidth: 0,
                    overflow: 'hidden',
                })
            "
        >
            <aside
                v-if="factoryPaletteState.factoryPaletteOpened"
                :class="
                    vstack({
                        alignItems: 'stretch',
                        width: { base: '190px', sm: '190px', lg: '260px' },
                        flexShrink: 0,
                        overflow: 'hidden',
                    })
                "
            >
                <div :class="scrollBar({ scrollable: factoryPaletteState.itemSearchOpened ? 'no' : 'yes' })">
                    <slot name="factoryPalette" />
                </div>
            </aside>

            <main
                :class="
                    stack({
                        flex: '1 1 0%',
                        minWidth: 0,
                        minHeight: 0,
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
