/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {GameItemType} from '#types/contants';
import type {GameItem} from '#types/game-data';
import type {GameImplementation} from '#types/game-implementation';
import {freezeMap} from '../util';
import {useGameDataParser} from './game-data-parser';

export function useGameDataHolder(gameImplementation: GameImplementation) {
    const parsedGameData = useGameDataParser(gameImplementation);

    const gameItemsMap = parsedGameData.parsedItems;
    const gameItemsArray = [...gameItemsMap.values()];
    Object.freeze(gameItemsArray);

    const gameItemsByType = gameItemsArray.reduce((map, item) => {
        const type = item.type || GameItemType.Unknown;
        const items = map.get(type);
        if(!items) {
            map.set(type, [item]);
        } else {
            items.push(item);
        }
        return map;
    }, new Map<GameItemType, GameItem[]>());

    const gameFactoriesArray = gameItemsArray.filter((item) => item.recipeDictionary);
    Object.freeze(gameFactoriesArray);

    const emptyRecipeDictionary = parsedGameData.emptyRecipeDictionary;

    return {
        gameItemsMap,
        gameItemsArray,
        gameItemsByType: freezeMap(gameItemsByType),
        getGameItem: (name: string) => gameItemsMap.get(name),
        gameFactoriesArray,
        getItemRecipeDictionary: (item?: GameItem) => (item?.recipeDictionary || emptyRecipeDictionary),
        gameImages: parsedGameData.images,
        getImage: (name: string) => parsedGameData.images[name],
        gameDescription: parsedGameData.description,
    };
}

export type GameData = ReturnType<typeof useGameDataHolder>;
