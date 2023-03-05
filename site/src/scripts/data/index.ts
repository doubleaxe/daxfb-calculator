/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {inject, ref, shallowRef, unref, watch, type InjectionKey, type Ref, type ShallowRef} from 'vue';
import {useGameDataHolder, type GameData} from './game-data-holder';
export type {GameData};
import gameList from '#types/game-list.json';
import {createCss, loadScript} from '../load-script-css';
import type {GameImplementation} from '#types/game-implementation';
import {useDebounceFn} from '@vueuse/core';

const __VERSION__ = 'v=' + encodeURIComponent(import.meta.env.VITE_VERSION);

function initializeCss(gameId: string) {
    const cssContent = `.icon-component {background-image: url(games/${encodeURIComponent(gameId)}/images.png?${__VERSION__});}`;
    createCss(cssContent);
}

export const GameDataKey = Symbol('GameData') as InjectionKey<ShallowRef<GameData>>;

export function useGameDataProvider(gameId: Ref<string>, onError?: (e: unknown) => void) {
    const isLoading = ref(false);
    const isReady = ref(false);
    const isFailed = ref(false);
    const isAutomatic = ref(false);
    const gameDataRef = shallowRef<GameData | undefined>();

    function loadGameData() {
        const _gameId = unref(gameId);
        Promise.resolve()
            .then(() => new Promise((resolve) => { setTimeout(resolve, 1); }))
            .then(() => {
                if(!(_gameId in gameList))
                    throw new Error(`Invalid game id: ${_gameId}`);
                return loadScript(`games/${encodeURIComponent(_gameId)}/game.js?${__VERSION__}`, {
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
    const loadGameDataDebounce = useDebounceFn(loadGameData, 250);

    watch(gameId, () => {
        if(!unref(gameId)) {
            return;
        }
        gameDataRef.value = undefined;
        isLoading.value = true;
        isReady.value = false;
        isFailed.value = false;
        unref(isAutomatic) ? loadGameData() : loadGameDataDebounce();
    }, {immediate: true});

    return {
        isLoading,
        isReady,
        isFailed,
        isAutomatic,
        gameDataRef,
        gameList,
    };
}

export function injectGameData(): GameData {
    const gameData = unref(inject(GameDataKey));
    if(!gameData)
        throw new Error('gameData not instantiated');
    return gameData;
}
