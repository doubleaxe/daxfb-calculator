import { useContext } from 'react';

import { GameContext } from '#core/game/parser';

import type { GameDataCoi } from './ParsedGameData';

export function useGameData() {
    const gameData = useContext(GameContext);
    if (!gameData) {
        throw new Error('GameContext was not found');
    }
    return gameData as GameDataCoi;
}
