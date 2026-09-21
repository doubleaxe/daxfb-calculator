import { useGameDataBase } from '@doubleaxe/daxfb-calculator-core/game/parser';

import type { GameDataCoi } from './ParsedGameData.js';

export function useGameData() {
    return useGameDataBase() as GameDataCoi;
}
