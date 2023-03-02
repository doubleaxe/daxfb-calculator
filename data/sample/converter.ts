/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import description from './description.json';
import {generateImages} from './generate-images';
import {gameData as generatedGameData} from './generate-data';
import type {ConvertedData} from '../processing';
import type {GameDataSerialized} from '#types/game-data-serialized';

async function useConverter(): Promise<ConvertedData> {
    const images = await generateImages();
    const gameData: GameDataSerialized = {
        ...generatedGameData,
        images: images.imageJson,
        description,
    };
    return {
        gameData,
        imagesData: images.image,
    };
}

export default {
    useConverter,
};
