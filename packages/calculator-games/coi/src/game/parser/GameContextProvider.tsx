import { GameContext } from '@doubleaxe/daxfb-calculator-core/game/parser';
import type { BaseProps } from '@doubleaxe/daxfb-calculator-core/types/props';
import { lazy, useRef } from 'react';

import { GameDataCoiImpl } from './ParsedGameData.js';

const GameContextProvider = lazy(async () => {
    const [{ gameDataJson }, { localeJson }] = await Promise.all([
        import('@doubleaxe/daxfb-gamedata-generated/coi'),
        import('@doubleaxe/daxfb-gamedata-generated/coi/locales/en'),
    ]);

    gameDataJson.locale = localeJson;
    const initialGameData = new GameDataCoiImpl(gameDataJson);

    function GameContextProviderComponent({ children }: BaseProps) {
        const gameData = useRef(initialGameData).current;
        return <GameContext value={gameData}>{children}</GameContext>;
    }
    return {
        default: GameContextProviderComponent,
    };
});

export default GameContextProvider;
