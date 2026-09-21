<script setup lang="ts">
import MantineInit from '@doubleaxe/daxfb-calculator-core/ui/MantineInit';
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue';

import { GameIds } from './GameIds.js';

const LandingPage = defineAsyncComponent(() => import('./pages/LandingPage.vue'));
const CoiGamePage = defineAsyncComponent(() => import('./pages/CoiGamePage.vue'));

const getGameId = () => new URLSearchParams(window.location.search).get('gameId');

const gameId = ref<null | string>(getGameId());

const updateGameId = () => {
    gameId.value = getGameId();
};

onMounted(() => {
    window.addEventListener('popstate', updateGameId);
});

onUnmounted(() => {
    window.removeEventListener('popstate', updateGameId);
});

const pageComponent = computed(() => (gameId.value === GameIds.COI ? CoiGamePage : LandingPage));

const fallbackClass = css({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
</script>

<template>
    <MantineInit>
        <Suspense>
            <component :is="pageComponent" />
            <template #fallback>
                <div :class="fallbackClass">
                    <ProgressSpinner />
                </div>
            </template>
        </Suspense>
    </MantineInit>
</template>
