import { lazy, useRef } from 'react';

import { GameContext } from '#core/game/parser';
import type { BaseProps } from '#core/types/props';

import { GameDataCoiImpl } from './ParsedGameData';

const GameContextProvider = lazy(async () => {
    const [{ gameDataJson }, { localeJson }] = await Promise.all([
        import('#daxfb-gamedata-generated/coi'),
        import('#daxfb-gamedata-generated/coi/locales/en'),
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
