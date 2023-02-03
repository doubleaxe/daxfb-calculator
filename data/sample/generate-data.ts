/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JsonData} from '../json-data-types';

const jsonContent: JsonData = {
    recipes: [{
        Name: 'V',
        Recipes: [{
            Input: [{
                Count: 1,
                Name: 'A',
            }],
            Name: 'V1',
            Output: [{
                Count: 2,
                Name: 'B',
            }],
            ResourceInput: {
                Count: 1,
                Name: 'R',
            },
            Ticks: 1,
        }, {
            Input: [{
                Count: 1,
                Name: 'A',
            }],
            Name: 'V2',
            Output: [{
                Count: 4,
                Name: 'C',
            }],
            ResourceInput: {
                Count: 2,
                Name: 'R',
            },
            Ticks: 1,
        }],
    }, {
        Name: 'W',
        Recipes: [{
            Input: [{
                Count: 1,
                Name: 'B',
            }, {
                Count: 2,
                Name: 'C',
            }],
            Name: 'W1',
            Output: [{
                Count: 3,
                Name: 'D',
            }],
            ResourceInput: {
                Count: 1,
                Name: 'R',
            },
            Ticks: 1,
        }],
    }, {
        Name: 'M',
        Recipes: [{
            Input: [],
            Name: 'M1',
            Output: [{
                Count: 4,
                Name: 'A',
            }],
            ResourceInput: {
                Count: 5,
                Name: 'R',
            },
            Ticks: 1,
        }],
    }, {
        Name: 'G',
        Recipes: [{
            Input: [],
            Name: 'G1',
            Output: [],
            ResourceOutput: {
                Count: 5,
                Name: 'R',
            },
            Ticks: 1,
        }],
    }],
    items: [{
        Image: 'A',
        Name: 'A',
        Label: 'Item A',
    }, {
        Image: 'B',
        Name: 'B',
        Label: 'Item B',
    }, {
        Image: 'C',
        Name: 'C',
        Label: 'Item C',
    }, {
        Image: 'D',
        Name: 'D',
        Label: 'Item D',
    }, {
        Image: 'R',
        Name: 'R',
        Label: 'Resource',
    }, {
        Image: 'G',
        Name: 'G',
        Label: 'Generator',
        Recipe: {
            RecipeDictionary: 'G',
            Tier: 1,
        },
    }, {
        Image: '1',
        Name: '1',
        Label: 'Factory 1',
        Recipe: {
            RecipeDictionary: 'V',
            Tier: 1,
        },
    }, {
        Image: '2',
        Name: '2',
        Label: 'Factory 2',
        Recipe: {
            RecipeDictionary: 'W',
            Tier: 1,
        },
    }, {
        Image: '3',
        Name: '3',
        Label: 'Factory 2X',
        Recipe: {
            RecipeDictionary: 'W',
            Tier: 2,
        },
    }, {
        Image: 'M',
        Name: 'M',
        Label: 'Ore Miner 1',
        Recipe: {
            RecipeDictionary: 'M',
            Tier: 1,
        },
    }, {
        Image: 'N',
        Name: 'N',
        Label: 'Ore Miner 1X',
        Recipe: {
            RecipeDictionary: 'M',
            Tier: 2,
        },
    }],
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __parsed = path.join(__dirname, 'parsed');

(async function() {
    await fs.writeFile(path.join(__parsed, 'data.json'), JSON.stringify(jsonContent, undefined, '  '));
})().catch((err) => console.error(err.stack));