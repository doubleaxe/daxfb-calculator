import { createContext, useContext } from 'react';

import type { GameDataBase } from './ParsedGameData';

export const GameContextBase = createContext(null as GameDataBase | null);
export function useGameContextBase() {
    const gameContext = useContext(GameContextBase);
    if (!gameContext) {
        throw new Error('GameContext was not found');
    }
    return gameContext;
}
