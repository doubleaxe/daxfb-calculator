/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {inject, ref, type App, type InjectionKey} from 'vue';
import {useGameDataHolder, type GameData} from './game-data-holder';
export type {GameData};
import gameList from '#types/game-list.json';
import {loadScript} from '../load-script';
import type {GameImplementation} from '#types/game-implementation';

export const GameDataKey = Symbol('GameData') as InjectionKey<GameData>;
export function useGameDataProvider(gameId: string, app: App, onError?: (e: unknown) => void) {
    const isReady = ref(false);
    const isFailed = ref(false);

    Promise.resolve()
        .then(() => new Promise((resolve) => { setTimeout(resolve, 1); }))
        .then(() => {
            if(gameList.indexOf(gameId) < 0)
                throw new Error(`Invalid game id: ${gameId}`);
            return loadScript(`games/${encodeURIComponent(gameId)}/game.js`, {
                globalVariable: 'gameImplementation',
            });
        })
        .then((_gameImplementation) => {
            const gameImplementation = _gameImplementation as GameImplementation;
            const gameData = useGameDataHolder(gameImplementation);
            app.provide(GameDataKey, gameData);
            isReady.value = true;
        })
        .catch((err) => {
            isFailed.value = true;
            onError?.(err);
        });

    return {
        isReady,
        isFailed,
    };
}

export const injectGameData = () => {
    const gameData = inject(GameDataKey);
    if(!gameData)
        throw new Error('gameData not instantiated');
    return gameData;
};
