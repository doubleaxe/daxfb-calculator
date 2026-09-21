<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';

import { GameIds } from '../GameIds.js';

const shell = css({ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' });
const main = css({ flex: 1, padding: '4' });
const container = css({ maxWidth: '2xl', marginInline: 'auto', marginTop: '8' });
const paper = css({
    padding: '8',
    boxShadow: 'xs',
    borderRadius: 'lg',
    backgroundColor: 'var(--p-content-background)',
});
const title = css({ marginBottom: '5', textAlign: 'center', fontSize: '3xl', fontWeight: 'bold' });
const list = css({ fontSize: 'md', paddingLeft: '6' });
const listItem = css({ marginBottom: '4' });
const anchor = css({ fontSize: 'lg', color: 'var(--p-primary-color)' });
const footer = css({ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' });
const footerText = css({ fontSize: 'sm', textAlign: 'center' });
</script>

<template>
    <div :class="shell">
        <div :class="main">
            <div :class="container">
                <div :class="paper">
                    <h1 :class="title">Select Game</h1>
                    <ul :class="list">
                        <li :class="listItem">
                            <a :class="anchor" :href="`?gameId=${GameIds.COI}`">Captain of Industry</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <footer :class="footer">
            <span :class="footerText">Extra small text</span>
        </footer>
    </div>
</template>
