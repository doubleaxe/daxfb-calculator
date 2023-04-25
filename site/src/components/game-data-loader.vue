<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {useLinkApi, useErrorHandler} from '@/composables';
import {useGameDataProvider} from '@/scripts/data';
import {computed, onMounted, ref, unref, watch} from 'vue';

const emit = defineEmits(['ready']);

let blueprintData = '';
const loadGameId = ref('');
const gameId = ref('');
const {showError} = useErrorHandler();
const {gameList, gameDataRef, isReady, isLoading: isGameDataLoading, isAutomatic} = useGameDataProvider(gameId, (err: unknown) => {
    blueprintData = '';
    gameId.value = '';
    isAutomatic.value = false;
    showError('Failed to load game data', err);
});
const {isLoading: isLinkLoading, exec} = useLinkApi();
const isLoading = computed(() => unref(isGameDataLoading) || unref(isLinkLoading));

watch(gameDataRef, () => {
    const gameData = unref(gameDataRef);
    if(gameData) {
        if(blueprintData) {
            gameData.initPreloadBlueprint(blueprintData);
        }
        emit('ready', gameData);
    }
});

function loadGameData(_gameId: string) {
    loadGameId.value = _gameId;
    gameId.value = _gameId;
    isAutomatic.value = true;
}

function loadGameDataManual() {
    gameId.value = unref(loadGameId);
    isAutomatic.value = false;
}

function fetchLink(_gameId: string | null | undefined, link: string) {
    type LoadLinkResponse = {
        gameId: string;
        data: string;
    };
    exec<LoadLinkResponse>('load', {link})
        .then((loadedLink: LoadLinkResponse) => {
            if(!loadedLink.gameId || (typeof (loadedLink.gameId) !== 'string')
                || !loadedLink.data || (typeof (loadedLink.data) !== 'string')) {
                throw new Error('data provider returned invalid response');
            }
            if(_gameId && (loadedLink.gameId !== _gameId)) {
                throw new Error(`gameId mismatch: ${loadedLink.gameId} != ${_gameId}`);
            }
            blueprintData = loadedLink.data;
            loadGameData(loadedLink.gameId);
        })
        .catch((err) => {
            showError('Failed to load link', err);
        });
}

onMounted(() => {
    const seacrhParams = new URLSearchParams(window.location.search);
    const _gameId = seacrhParams.get('gameId');
    const link = seacrhParams.get('link');
    if(link) {
        fetchLink(_gameId, link);
    }
    if(_gameId) {
        loadGameData(_gameId);
    }
});
</script>

<template>
    <v-card v-if="!isReady" title="Select game" variant="outlined">
        <v-card-text>
            <v-radio-group v-model="loadGameId">
                <v-radio v-for="(value, key) in gameList" :key="key" :label="value" :value="key" />
            </v-radio-group>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" variant="outlined" :disabled="!loadGameId" @click="loadGameDataManual">
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
