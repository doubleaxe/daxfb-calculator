<script setup lang="ts">
import InitApplication from '@doubleaxe/daxfb-calculator-core/ui/InitApplication';
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { createReusableTemplate } from '@vueuse/core';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue';

import { GameIds } from './GameIds.js';

const [DefineFallback, Fallback] = createReusableTemplate();

const asyncOptions = {
    loadingComponent: Fallback,
    delay: 200,
};

const LandingPage = defineAsyncComponent({
    loader: () => import('./pages/LandingPage.vue'),
    ...asyncOptions,
});
const CoiGamePage = defineAsyncComponent({
    loader: () => import('./pages/CoiGamePage.vue'),
    ...asyncOptions,
});

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
</script>

<template>
    <InitApplication>
        <DefineFallback>
            <div
                :class="
                    css({
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    })
                "
            >
                <ProgressSpinner />
            </div>
        </DefineFallback>
        <component :is="pageComponent" />
    </InitApplication>
</template>
