/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import description from './description.json';
import {generateImages} from './generate-images';
import {gameData as generatedGameData} from './generate-data';
import type {Converter} from '../processing';
import type {GameData} from '#types/game-data';

export function useConverter(): Converter {
    let gameData: GameData | undefined;
    let image: Buffer | undefined;
    async function init() {
        if(gameData && image) {
            return {gameData, image};
        }
        const images = await generateImages();
        gameData = {
            ...generatedGameData,
            images: images.imageJson,
            description,
        };
        image = images.image;
        return {gameData, image};
    }

    return {
        async convertGameData() {
            return (await init()).gameData;
        },
        async loadImages() {
            return (await init()).image;
        },
    };
}
