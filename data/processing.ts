/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {
    GameData,
} from '#types/game-data';

export interface Converter {
    convertGameData: () => Promise<GameData>;
    loadImages: () => Promise<Buffer>;
}

export type ConverterFactory = () => Converter;
