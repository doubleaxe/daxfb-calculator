import type { GameDataCoiJson, GameDescriptionCoiJson } from '#daxfb-shared/types/gamedata/coi.js';

import { itemsJson } from './coi/items.js';
import { recipesJson } from './coi/recipes.js';

const descriptionJson: GameDescriptionCoiJson = {
    name: 'coi',
    shortName: 'CI',
    description: 'Captain of Industry',
    url: 'https://www.captain-of-industry.com/',
    version: '0.6.0a(B315) - Update 2',
    saveVersion: 6,
    compatibleSaveVersions: [5, 6],
};

export const gameDataJson: GameDataCoiJson = {
    description: descriptionJson,
    items: itemsJson,
    recipes: recipesJson,
};
