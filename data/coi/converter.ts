/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';
import description from './description.json';
import type {ConvertedData} from '../processing';
import type {GameDataSerialized, GameImagesSerialized} from '#types/game-data-serialized';

const _dirname = __dirname;
const __parsed = path.join(_dirname, 'parsed');

async function useConverter(): Promise<ConvertedData> {
    const imagesData = fs.readFileSync(path.join(__parsed, 'images.png'));
    const imagesJson: GameImagesSerialized = JSON.parse(fs.readFileSync(path.join(__parsed, 'images.json'), 'utf8'));
    const gameData0: Partial<GameDataSerialized> = JSON.parse(fs.readFileSync(path.join(__parsed, 'data.json'), 'utf8'));

    const gameData: GameDataSerialized = {
        ...gameData0,
        images: imagesJson,
        description,
    } as GameDataSerialized;
    return {
        gameData,
        imagesData,
    };
}

export default {
    useConverter,
};
