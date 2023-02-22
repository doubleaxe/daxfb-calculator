/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {Calculator} from './calculator';
import type {GameDataSerialized} from './game-data-serialized';

//virtual doesn't build typescript files
//check build-data.ts whenever GameImplementation interface changes
export type GameImplementation = {
    useCalculator: () => Calculator;
    useGameData: () => GameDataSerialized | string;
};
