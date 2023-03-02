/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    GameDataSerialized,
} from '#types/game-data-serialized';

export interface ConvertedData {
    gameData: GameDataSerialized;
    imagesData: Buffer;
}

export type ConverterFactory = {
    useConverter: () => Promise<ConvertedData>;
};
