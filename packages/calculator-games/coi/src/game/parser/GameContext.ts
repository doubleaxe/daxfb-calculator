import { useContext } from 'react';

import { GameContextBase } from '#core/game/parser';

import type { GameDataCoi } from './ParsedGameData';

export function useGameContext() {
    const gameContext = useContext(GameContextBase);
    if (!gameContext) {
        throw new Error('GameContext was not found');
    }
    return gameContext as GameDataCoi;
}
