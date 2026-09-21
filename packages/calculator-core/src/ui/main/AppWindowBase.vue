<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

const factoryPaletteState = useFactoryPaletteState();
</script>

<template>
    <div :class="css({ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' })">
        <header :class="css({ height: '60px', flexShrink: 0 })">
            <slot name="toolbar" />
        </header>

        <div :class="css({ display: 'flex', minHeight: 0, flex: 1 })">
            <nav
                v-if="factoryPaletteState.factoryPaletteOpened"
                :class="
                    css({
                        width: '190px',
                        flexShrink: 0,
                        overflowY: factoryPaletteState.itemSearchOpened ? 'hidden' : 'auto',
                        lg: { width: '260px' },
                    })
                "
            >
                <slot name="factoryPalette" />
            </nav>

            <main :class="css({ width: '100%', height: '100%', minWidth: 0, flex: 1, padding: '4' })">
                <slot name="flowChart" />
            </main>
        </div>
    </div>
</template>
