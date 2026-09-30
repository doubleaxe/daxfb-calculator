import { useGameDataBase } from '@doubleaxe/daxfb-calculator-core/game/parser/index.js';

import type { GameDataCoi } from './ParsedGameData.js';

export function useGameData() {
    return useGameDataBase() as GameDataCoi;
}
