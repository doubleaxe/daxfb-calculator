/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameDataSerialized} from '#types/game-data-serialized';

export const gameData: Omit<GameDataSerialized, 'description' | 'images'> = {
    recipeDictionaries: [{
        name: 'V',
        recipes: [{
            input: [{
                count: 1,
                name: 'A',
            }, {
                count: 1,
                name: 'R',
            }],
            name: 'V1',
            output: [{
                count: 2,
                name: 'B',
            }],
            time: 1,
        }, {
            input: [{
                count: 1,
                name: 'A',
            }, {
                count: 2,
                name: 'R',
            }],
            name: 'V2',
            output: [{
                count: 4,
                name: 'C',
            }],
            time: 1,
        }, {
            input: [{
                count: 1000000,
                name: 'A',
            }, {
                count: 2000000,
                name: 'R',
            }],
            name: 'V3',
            output: [{
                count: 4000000,
                name: 'C',
            }],
            time: 1,
        }],
    }, {
        name: 'W',
        recipes: [{
            input: [{
                count: 1,
                name: 'B',
            }, {
                count: 2,
                name: 'C',
            }, {
                count: 1,
                name: 'R',
            }],
            name: 'W1',
            output: [{
                count: 3,
                name: 'D',
            }],
            time: 1,
        }],
    }, {
        name: 'X',
        recipes: [{
            input: [{
                count: 3,
                name: 'D',
            }, {
                count: 5,
                name: 'R',
            }],
            name: 'X1',
            output: [{
                count: 4,
                name: 'B',
            }, {
                count: 2,
                name: 'C',
            }],
            time: 1,
        }],
    }, {
        name: 'M',
        recipes: [{
            input: [{
                count: 5,
                name: 'R',
            }],
            name: 'M1',
            output: [{
                count: 4,
                name: 'A',
            }],
            time: 1,
        }],
    }, {
        name: 'G',
        recipes: [{
            input: [],
            name: 'G1',
            output: [{
                count: 5,
                name: 'R',
            }],
            time: 1,
        }],
    }],
    items: [{
        image: 'A',
        name: 'A',
        label: 'Item A',
    }, {
        image: 'B',
        name: 'B',
        label: 'Item B',
    }, {
        image: 'C',
        name: 'C',
        label: 'Item C',
    }, {
        image: 'D',
        name: 'D',
        label: 'Item D',
    }, {
        image: 'R',
        name: 'R',
        label: 'Resource',
    }, {
        image: 'G',
        name: 'G',
        label: 'Generator',
        recipe: {
            recipeDictionary: 'G',
            tier: 1,
        },
    }, {
        image: '1',
        name: '1',
        label: 'Factory 1',
        recipe: {
            recipeDictionary: 'V',
            tier: 1,
        },
    }, {
        image: '2',
        name: '2',
        label: 'Factory 2',
        recipe: {
            recipeDictionary: 'W',
            tier: 1,
        },
    }, {
        image: '3',
        name: '3',
        label: 'Factory 2X',
        recipe: {
            recipeDictionary: 'W',
            tier: 2,
        },
    }, {
        image: '4',
        name: '4',
        label: 'Factory 3',
        recipe: {
            recipeDictionary: 'X',
            tier: 1,
        },
    }, {
        image: 'M',
        name: 'M',
        label: 'Ore Miner 1',
        recipe: {
            recipeDictionary: 'M',
            tier: 1,
        },
    }, {
        image: 'N',
        name: 'N',
        label: 'Ore Miner 1X',
        recipe: {
            recipeDictionary: 'M',
            tier: 2,
        },
    }, {
        image: 'S',
        name: 'S',
        label: 'Logistic S',
    }, {
        image: 'T',
        name: 'T',
        label: 'Logistic T',
    }],
    logistic: [{
        name: 'S',
        label: 'Logistic',
        items: [{
            name: 'A',
        }, {
            name: 'B',
        }, {
            name: 'C',
        }, {
            name: 'D',
        }],
        transport: [{
            name: 'S',
            count: 1,
        }, {
            name: 'T',
            count: 2,
        }],
        time: 1,
        stackable: true,
    }],
};
