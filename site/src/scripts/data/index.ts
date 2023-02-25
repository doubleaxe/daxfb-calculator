/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {ref, unref, watch, type Ref} from 'vue';
import {useGameDataHolder, type GameData} from './game-data-holder';
export type {GameData};
import gameList from '#types/game-list.json';
import {createCss, loadScript} from '../load-script-css';
import type {GameImplementation} from '#types/game-implementation';

function initializeCss(gameId: string) {
    const cssContent = `
.icon-component {
    background-image: url(games/${encodeURIComponent(gameId)}/images.png);
};
`;
    createCss(cssContent);
}

const gameDataRef = ref<GameData | undefined>();

export function useGameDataProvider(gameId: Ref<string>, onError?: (e: unknown) => void) {
    const isLoading = ref(false);
    const isReady = ref(false);
    const isFailed = ref(false);

    function loadGameData() {
        const _gameId = unref(gameId);
        isLoading.value = true;
        Promise.resolve()
            .then(() => new Promise((resolve) => { setTimeout(resolve, 1); }))
            .then(() => {
                if(!(_gameId in gameList))
                    throw new Error(`Invalid game id: ${_gameId}`);
                return loadScript(`games/${encodeURIComponent(_gameId)}/game.js`, {
                    globalVariable: 'gameImplementation',
                });
            })
            .then((_gameImplementation) => {
                const gameImplementation = _gameImplementation as GameImplementation;
                const gameData = useGameDataHolder(gameImplementation);

                initializeCss(_gameId);

                gameDataRef.value = gameData;
                isLoading.value = false;
                isReady.value = true;
            })
            .catch((err) => {
                isLoading.value = false;
                isFailed.value = true;
                onError?.(err);
            });
    }

    watch(gameId, () => {
        if(!unref(gameId)) {
            return;
        }
        gameDataRef.value = undefined;
        isReady.value = false;
        isFailed.value = false;
        loadGameData();
    }, {immediate: true});

    return {
        isLoading,
        isReady,
        isFailed,
        gameDataRef,
        gameList,
    };
}

export function injectGameData(): GameData {
    const gameData = unref(gameDataRef);
    if(!gameData)
        throw new Error('gameData not instantiated');
    return gameData;
}

export function injectGameDataRef() {
    return gameDataRef;
}
