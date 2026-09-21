import { createInjectionState } from '@vueuse/core';

import type { GameDataBase } from './ParsedGameData.js';

const [useProvideGameDataBase, _useGameDataBase] = createInjectionState(
    (gameData: GameDataBase): GameDataBase => gameData
);

export { useProvideGameDataBase };
export function useGameDataBase() {
    const gameData = _useGameDataBase();
    if (!gameData) {
        throw new Error('GameData is not provided');
    }
    return gameData;
}
