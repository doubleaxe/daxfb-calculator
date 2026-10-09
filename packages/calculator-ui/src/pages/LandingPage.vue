<script setup lang="ts">
import { vstack } from '@daxfb/styles/patterns';
import { prose } from '@daxfb/styles/recipes';
import Panel from 'primevue/panel';

import { GameIds } from '../GameIds.js';
</script>

<template>
    <div
        :class="
            vstack({
                minHeight: '100%',
                justifyContent: 'space-between',
                padding: '6',
            })
        "
    >
        <div />
        <Panel
            :class="
                vstack({
                    width: '100%',
                    maxWidth: '400px',
                })
            "
        >
            <div :class="prose()">
                <h1>Select Game</h1>

                <ul>
                    <li>
                        <a :href="`?gameId=${GameIds.COI}`">Captain of Industry</a>
                    </li>
                </ul>
            </div>
        </Panel>
        <footer>Extra small text</footer>
    </div>
</template>
