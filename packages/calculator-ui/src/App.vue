<script setup lang="ts">
import InitApplication from '@daxfb/core/ui/InitApplication.vue';
import { css } from '@daxfb/styles/css';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, defineAsyncComponent, onErrorCaptured, onMounted, onUnmounted, ref } from 'vue';

import { GameIds } from './GameIds.js';

const hasLoaded = ref(false);
const asyncOptions = {
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
const fatalError = ref<Error | null>(null);

const updateGameId = () => {
    gameId.value = getGameId();
};

onMounted(() => {
    window.addEventListener('popstate', updateGameId);
});

onUnmounted(() => {
    window.removeEventListener('popstate', updateGameId);
});

const pageComponent = computed(() => {
    const _gameId = gameId.value;
    if (!_gameId) return LandingPage;
    switch (_gameId) {
        case GameIds.COI:
            return CoiGamePage;
    }
    return LandingPage;
});

onErrorCaptured((err) => {
    if (hasLoaded.value) {
        return true;
    }
    fatalError.value = err;
    return false;
});
</script>

<template>
    <InitApplication>
        <div v-if="fatalError">Failed to load: {{ fatalError.message }}</div>
        <Suspense v-else @resolve="hasLoaded = true">
            <component :is="pageComponent" />
            <template #fallback>
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
            </template>
        </Suspense>
    </InitApplication>
</template>
