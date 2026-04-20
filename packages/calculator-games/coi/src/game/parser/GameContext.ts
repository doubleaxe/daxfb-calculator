import { GameContext } from '@doubleaxe/daxfb-calculator-core/game/parser';
import { useContext } from 'react';

import type { GameDataCoi } from './ParsedGameData.js';

export function useGameData() {
    const gameData = useContext(GameContext);
    if (!gameData) {
        throw new Error('GameContext was not found');
    }
    return gameData as GameDataCoi;
}
