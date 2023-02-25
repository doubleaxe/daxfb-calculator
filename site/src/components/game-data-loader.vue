<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {useErrorHandler} from '@/composables/error-handler';
import {useGameDataProvider} from '@/scripts/data';
import {onMounted, ref, unref, watch} from 'vue';

const emit = defineEmits(['ready']);

const loadGameId = ref('');
const gameId = ref('');
const {showError} = useErrorHandler();
const {gameList, isReady, isLoading} = useGameDataProvider(gameId, (err: unknown) => {
    showError('Failed to load game data', err);
});

watch(isReady, () => {
    if(unref(isReady)) {
        emit('ready');
    }
});

onMounted(() => {
    const seacrhParams = new URLSearchParams(window.location.search);
    const _gameId = seacrhParams.get('gameId');
    if(_gameId) {
        gameId.value = _gameId;
    }
});
</script>

<template>
    <v-card v-if="!isReady && !isLoading" title="Select game" variant="outlined">
        <v-card-text>
            <v-radio-group v-model="loadGameId">
                <v-radio v-for="(value, key) in gameList" :key="key" :label="value" :value="key" />
            </v-radio-group>
        </v-card-text>
        <v-card-actions>
            <v-btn :disabled="!loadGameId" @click="gameId = loadGameId">
                Load game
            </v-btn>
        </v-card-actions>
        <v-overlay
            v-model="isLoading"
            contained
            class="align-center justify-center"
        >
            <v-progress-circular indeterminate color="primary" />
        </v-overlay>
    </v-card>
</template>

<style scoped>
.help-parent {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.help-iframe {
    width: 100%;
    flex-grow: 1;
    border: 0px;
}
</style>
