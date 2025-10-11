import { lazy } from 'react';

import { GameContextBase } from '#core/game/parser';
import type { BaseProps } from '#core/types/props';

import { GameDataCoiImpl } from './ParsedGameData';

const GameContextProvider = lazy(async () => {
    const [{ gameDataJson }, { localeJson }] = await Promise.all([
        import('#daxfb-gamedata-generated/coi'),
        import('#daxfb-gamedata-generated/coi/locales/en'),
    ]);

    gameDataJson.locale = localeJson;
    const gameData = new GameDataCoiImpl(gameDataJson);

    function GameContextProviderComponent({ children }: BaseProps) {
        return <GameContextBase value={gameData}>{children}</GameContextBase>;
    }
    return {
        default: GameContextProviderComponent,
    };
});

export default GameContextProvider;
