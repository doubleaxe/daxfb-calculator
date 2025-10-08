import { createContext, useContext } from 'react';

import type { GameDataCoi } from './ParsedGameData';

export const GameContext = createContext(null as GameDataCoi | null);
export function useGameContext() {
    const gameContext = useContext(GameContext);
    if (!gameContext) {
        throw new Error('GameContext was not found');
    }
    return gameContext;
}
