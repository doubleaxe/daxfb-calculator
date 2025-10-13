import { createContext, useContext } from 'react';

import type { GameDataBase } from './ParsedGameData';

export const GameContext = createContext(null as GameDataBase | null);
export function useGameDataBase() {
    const gameData = useContext(GameContext);
    if (!gameData) {
        throw new Error('GameContext was not found');
    }
    return gameData;
}
