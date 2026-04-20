import { GameContext } from '@doubleaxe/daxfb-calculator-core/game/parser';
import type { BaseProps } from '@doubleaxe/daxfb-calculator-core/types/props';
import { lazy } from 'react';

import { GameDataCoiImpl } from './ParsedGameData.js';

function GameContextProviderComponent({ children, gameData }: { gameData: GameDataCoiImpl } & BaseProps) {
    return <GameContext value={gameData}>{children}</GameContext>;
}

const GameContextProvider = lazy(async () => {
    const [{ gameDataJson }, { localeJson }] = await Promise.all([
        import('@doubleaxe/daxfb-gamedata-generated/coi'),
        import('@doubleaxe/daxfb-gamedata-generated/coi/locales/en'),
    ]);

    gameDataJson.locale = localeJson;
    const initialGameData = new GameDataCoiImpl(gameDataJson);

    return {
        default: (props: BaseProps) => <GameContextProviderComponent {...props} gameData={initialGameData} />,
    };
});

export default GameContextProvider;
