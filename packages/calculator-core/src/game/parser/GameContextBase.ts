import { createInjectionState } from '@vueuse/core';

import type { GameDataBase } from './ParsedGameData.js';

const [useProvideGameDataBase, _useGameDataBase] = createInjectionState(() => {
    return null as GameDataBase | null;
});

export { useProvideGameDataBase };
export function useGameDataBase() {
    const gameData = _useGameDataBase();
    if (!gameData) {
        throw new Error('GameData is not provided');
    }
    return gameData;
}
