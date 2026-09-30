<script setup lang="ts">
import { cva } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack, stack, vstack } from '@doubleaxe/daxfb-calculator-styles/patterns';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

const factoryPaletteState = useFactoryPaletteState();

const scrollBar = cva({
    base: {
        width: '100%',
        height: '100%',
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
                gap: 0,
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
                    gap: 'md',
                })
            "
        >
            <slot name="toolbar" />
        </header>

        <div
            :class="
                hstack({
                    flex: '1 1 0%',
                    minHeight: 0,
                    width: '100%',
                    height: '100%',
                    alignItems: 'stretch',
                    overflow: 'hidden',
                })
            "
        >
            <aside
                v-if="factoryPaletteState.factoryPaletteOpened"
                :class="
                    vstack({
                        flexShrink: 0,
                        width: { base: '190px', sm: '190px', lg: '260px' },
                        height: '100%',
                        padding: 'md',
                        alignItems: 'stretch',
                        overflow: 'hidden',
                    })
                "
            >
                <div
                    :class="
                        vstack({
                            flex: '1 1 0%',
                            minHeight: 0,
                            width: '100%',
                            alignItems: 'stretch',
                        })
                    "
                >
                    <div :class="scrollBar({ scrollable: factoryPaletteState.itemSearchOpened ? 'no' : 'yes' })">
                        <slot name="factoryPalette" />
                    </div>
                </div>
            </aside>

            <main
                :class="
                    stack({
                        flex: '1 1 0%',
                        width: '100%',
                        height: '100%',
                        minWidth: 0,
                        minHeight: 0,
                        padding: 'md',
                        overflow: 'hidden',
                        alignItems: 'stretch',
                    })
                "
            >
                <slot name="flowChart" />
            </main>
        </div>
    </div>
</template>
