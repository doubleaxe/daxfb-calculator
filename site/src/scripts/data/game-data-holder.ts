/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameImplementation} from '#types/game-implementation';
import {useGameDataParser} from './game-data-parser';

export function useGameDataHolder(gameImplementation: GameImplementation) {
    const parsedGameData = useGameDataParser(gameImplementation);

    const gameItemsMap = parsedGameData.parsedItems;
    const gameItemsArray = [...gameItemsMap.values()];
    Object.freeze(gameItemsArray);

    const gameFactoriesArray = gameItemsArray.filter((item) => item.recipeDictionary);
    Object.freeze(gameFactoriesArray);

    return {
        gameItemsMap,
        gameItemsArray,
        gameFactoriesArray,
        gameImages: parsedGameData.images,
        gameDescription: parsedGameData.description,
    };
}

export type GameData = ReturnType<typeof useGameDataHolder>;
