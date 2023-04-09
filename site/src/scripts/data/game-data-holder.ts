/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {GameItemType} from '#types/constants';
import type {GameItem, GameLogistic} from '#types/game-data';
import type {GameImplementation} from '#types/game-implementation';
import {LOG, log} from '../debug';
import {freezeMap} from '../util';
import {useGameDataParser} from './game-data-parser';

export function useGameDataHolder(gameImplementation: GameImplementation) {
    const parsedGameData = useGameDataParser(gameImplementation);

    const gameItemsMap = parsedGameData.parsedItems;
    const gameItemsArray = [...gameItemsMap.values()];
    Object.freeze(gameItemsArray);

    const gameAbstractItems = gameItemsArray.reduce((map, item) => {
        if(item.isAbstractClassItem && item.type) {
            if(map.has(item.type)) {
                log(LOG.ERROR, `Duplicate abstract item type ${item.type}`);
            } else {
                map.set(item.type, item);
            }
        }
        return map;
    }, new Map<GameItemType, GameItem>());

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

    const gameLogisticByItemMap = new Map<string, GameLogistic[]>();
    const gameLogisticByTypeMap = new Map<GameItemType, GameLogistic[]>();
    for(const logistic of parsedGameData.parsedLogistic) {
        for(const {name} of logistic.items) {
            const item = gameItemsMap.get(name);
            if(item) {
                let logisticArray: GameLogistic[];
                if(item.isAbstractClassItem && item.type) {
                    let array = gameLogisticByTypeMap.get(item.type);
                    if(!array) {
                        array = [];
                        gameLogisticByTypeMap.set(item.type, array);
                    }
                    logisticArray = array;
                } else {
                    let array = gameLogisticByItemMap.get(name);
                    if(!array) {
                        array = [];
                        gameLogisticByItemMap.set(name, array);
                    }
                    logisticArray = array;
                }
                logisticArray.push(logistic);
            }
        }
    }

    const emptyRecipeDictionary = parsedGameData.emptyRecipeDictionary;

    const gameData = {
        gameItemsArray,
        gameAbstractItems: freezeMap(gameAbstractItems),
        gameItemsByType: freezeMap(gameItemsByType),
        getGameItem: (name: string) => gameItemsMap.get(name),
        gameFactoriesArray,
        getItemRecipeDictionary: (item?: GameItem) => (item?.recipeDictionary || emptyRecipeDictionary),
        getLogistic: (item: GameItem) => [
            ...(gameLogisticByItemMap.get(item.name) || []),
            ...((item.type && gameLogisticByTypeMap.get(item.type)) || []),
        ],
        gameImages: parsedGameData.images,
        getImage: (name: string) => parsedGameData.images[name],
        gameDescription: parsedGameData.description,
    };
    Object.freeze(gameData);
    return gameData;
}

export type GameData = ReturnType<typeof useGameDataHolder>;
