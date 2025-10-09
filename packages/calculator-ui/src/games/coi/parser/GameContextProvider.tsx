import { lazy } from 'react';

import type { BaseProps } from '#types/props';

import { GameContext } from './GameContext';
import { GameDataCoiImpl } from './ParsedGameData';

const GameContextProvider = lazy(async () => {
    const [{ gameDataJson }, { localeJson }] = await Promise.all([
        import('#daxfb-gamedata-generated/coi'),
        import('#daxfb-gamedata-generated/coi/locales/en'),
    ]);

    gameDataJson.locale = localeJson;
    const gameData = new GameDataCoiImpl(gameDataJson);

    function GameContextProviderComponent({ children }: BaseProps) {
        return <GameContext value={gameData}>{children}</GameContext>;
    }
    return {
        default: GameContextProviderComponent,
    };
});

export default GameContextProvider;
