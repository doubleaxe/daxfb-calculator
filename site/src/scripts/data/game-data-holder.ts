/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItem} from '#types/game-data';
import type {GameImplementation} from '#types/game-implementation';
import {useGameDataParser} from './game-data-parser';

export function useGameDataHolder(gameImplementation: GameImplementation) {
    const parsedGameData = useGameDataParser(gameImplementation);

    const gameItemsMap = parsedGameData.parsedItems;
    const gameItemsArray = [...gameItemsMap.values()];
    Object.freeze(gameItemsArray);

    const gameFactoriesArray = gameItemsArray.filter((item) => item.recipeDictionary);
    Object.freeze(gameFactoriesArray);

    const emptyRecipeDictionary = parsedGameData.emptyRecipeDictionary;

    return {
        gameItemsMap,
        gameItemsArray,
        getGameItem: (name: string) => gameItemsMap.get(name),
        gameFactoriesArray,
        getItemRecipeDictionary: (item?: GameItem) => (item?.recipeDictionary || emptyRecipeDictionary),
        gameImages: parsedGameData.images,
        getImage: (name: string) => parsedGameData.images[name],
        gameDescription: parsedGameData.description,
    };
}

export type GameData = ReturnType<typeof useGameDataHolder>;
