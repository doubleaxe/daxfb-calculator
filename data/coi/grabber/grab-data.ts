/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as path from 'node:path';
import * as fs from 'node:fs';
import {ImageProcessor} from '../../image-processor';
import machines from './captain-of-data/data/machines_and_buildings.json';
import products from './captain-of-data/data/products.json';
import type {
    GameDataSerialized,
    GameItemSerialized,
    GameRecipeDictionarySerialized,
    GameRecipeIOSerialized,
    GameRecipeSerialized,
} from '#types/game-data-serialized';
//using relative path, without #types, because it is compiled into js, and not handled by typescript only
import {GameItemType, GameRecipeIOFlags} from '../../../site/data/types/constants';
import {GameItemExData, GameItemExType} from '../types/custom-game-data';

//npx ts-node grab-data.ts
//node --loader ts-node/esm --inspect-brk grab-data.ts
const _dirname = __dirname;
const _target = path.join(_dirname, '../parsed');
const _static = path.join(_dirname, '../static/images');
const _images = path.join(_dirname, './captain-of-data/images');

function cleanProductId(id: string) {
    if(id.indexOf('Product_') == 0)
        id = id.substring('Product_'.length);
    if(id.indexOf('Virtual_') == 0)
        id = id.substring('Virtual_'.length);
    return id;
}

type ImageDef = {
    id: string;
    name: string;
    icon: string;
};
type ProductDef = typeof products.products[number];
type IODef = {
    name: string;
    quantity: number;
};
type RecipeDef = {
    id: string;
    name: string;
    duration: number;
    inputs: IODef[];
    outputs: IODef[];
};
type BuildingDef = typeof machines.machines_and_buildings[number];

const classTypes: {[key: string]: GameItemType} = {
    Virtual: GameItemType.Special,
    Countable: GameItemType.Countable,
    Loose: GameItemType.Loose,
    Molten: GameItemType.Molten,
    Fluid: GameItemType.Fluid,
};

const itemTypes: {[key: string]: GameItemType} = {
    Electricity: GameItemType.Energy,
    MechPower: GameItemType.Energy,
};

const itemExTypes: {[key: string]: GameItemExType} = {
    Electricity: GameItemExType.Electricity,
    MechPower: GameItemExType.MechPower,
    Computing: GameItemExType.Computing,
    Upoints: GameItemExType.Upoints,
    MaintenanceT1: GameItemExType.Maintenance,
    MaintenanceT2: GameItemExType.Maintenance,
    MaintenanceT3: GameItemExType.Maintenance,
    PollutedWater: GameItemExType.Pollution,
    PollutedAir: GameItemExType.Pollution,
    Worker: GameItemExType.Worker,
};

const whiteImages: Set<string> = new Set([
    'Anesthetics',
    'Antibiotics',
    'BasicServerRack',
    'Computing',
    'ConstructionParts',
    'LabEquipment',
    'MaintenanceT1',
    'MechPower',
    'MedicalSupplies',
    'Salt',
    'SiliconWafer',
    'Upoints',
    'VehicleParts',
    'Worker',
]);


(async function() {
    //add our custom products
    products.products.push({
        id: 'Worker',
        name: 'Worker',
        icon: 'Worker',
        type: 'Virtual',
    });

    const productNamesToDefs = new Map<string, ProductDef>(products.products.map((p) => [p.name, {...p, id: cleanProductId(p.id)}]));
    const productIdsToDefs = new Map<string, ProductDef>([...productNamesToDefs.values()].map((p) => [p.id, p]));
    console.log('Processing game data...');
    const gameData = await prepareGameData(productNamesToDefs, productIdsToDefs);
    console.log('Processing images...');
    await prepareImages(productIdsToDefs, gameData.items || []);
})().catch((err) => {
    console.error(err.stack);
    process.exit(1);
});

async function prepareImages(productIdsToDefs: Map<string, ProductDef>, items: GameItemSerialized[]) {
    const imagesPaths: ImageDef[] = [];
    for(const item of items) {
        if(item.recipe) {
            imagesPaths.push({
                id: item.name,
                name: item.name,
                icon: 'buildings/' + item.name + '.png',
            });
        } else {
            const def = productIdsToDefs.get(item.name);
            const iconName = def?.icon || item.name;
            imagesPaths.push({
                id: item.name,
                name: iconName,
                icon: 'products/' + iconName + '.png',
            });
        }
    }

    const imageProcessor = new ImageProcessor(32);
    imagesPaths.sort((a, b) => a.id.localeCompare(b.id));
    for(const image of imagesPaths) {
        const imagePath = path.join(_images, image.icon);
        try {
            let imageBuffer;
            try {
                imageBuffer = fs.readFileSync(imagePath);
            } catch(err) {
                if((err as NodeJS.ErrnoException).code != 'ENOENT')
                    throw err;
                imageBuffer = fs.readFileSync(path.join(_static, image.name + '.png'));
            }
            const img = await imageProcessor.addImageBuffer(imageBuffer, image.id);
            if(whiteImages.has(image.id)) {
                img.color([{apply: 'shade', params: [40]}]);
            }
        } catch(err) {
            if((err as NodeJS.ErrnoException).code != 'ENOENT')
                throw err;
            console.warn(`Failed to load image: ${imagePath}`);
        }
    }
    const {image: imagesData, references} = await imageProcessor.composeImage();
    fs.writeFileSync(path.join(_target, 'images.png'), imagesData);
    fs.writeFileSync(path.join(_target, 'images.json'), JSON.stringify(references));
}

type NextTier = {
    name: string;
    nextTier: string;
};

async function prepareGameData(productNamesToDefs: Map<string, ProductDef>, productIdsToDefs: Map<string, ProductDef>) {
    const productIds = new Set<string>(productIdsToDefs.keys());

    const {
        productsUsedInRecipes,
        recipeDictionaries,
        simpleFactories,
        nextTier,
    } = prepareFactories(productNamesToDefs, productIds);

    const tierFactoriesArray = splitFactoriesToTiers(simpleFactories, nextTier);
    const productsArray = await prepareProducts(productIdsToDefs, productsUsedInRecipes);

    //sort by name, but take tier chains into account
    const resultItems = tierFactoriesArray.concat(productsArray.map((p) => [p]));

    resultItems.sort((a, b) => (a[0]?.label?.localeCompare(b[0]?.label || '') || 0));

    const items: GameItemSerialized[] = resultItems.flat();

    const gameData: Partial<GameDataSerialized> = {
        recipeDictionaries,
        items,
    };
    fs.writeFileSync(path.join(_target, 'data.json'), JSON.stringify(gameData, null, 2));
    return gameData;
}

function prepareFactories(productNamesToDefs: Map<string, ProductDef>, productIds: Set<string>) {
    const buildingIds = new Set<string>();

    const recipeDictionaries: GameRecipeDictionarySerialized[] = [];
    const productsUsedInRecipes = new Set<string>();

    type AdditionalResources = {
        workers?: number;
        maintenanceType?: string;
        maintenance?: number;
        electricity?: number;
        computing?: number;
        unity?: number;
        isInput: boolean;
    };

    const mapIo = function(io: IODef[] | undefined, resources: AdditionalResources) {
        const exisingItems = new Set<string>();
        const _io = (io || []).map((i) => {
            const def = productNamesToDefs.get(i.name);
            if(!def)
                throw new Error(`unknown product name: (${i.name})`);
            exisingItems.add(def.id);
            const _i: GameRecipeIOSerialized = {
                name: def.id,
                count: i.quantity,
            };
            return _i;
        });

        if(resources.workers) {
            _io.push({name: 'Worker', count: resources.workers});
        }
        if(resources.maintenance) {
            const maintenanceDef = productNamesToDefs.get(resources.maintenanceType || '');
            if(!maintenanceDef)
                throw new Error(`unknown maintenance type: (${resources.maintenanceType})`);
            if(!exisingItems.has(maintenanceDef.id)) {
                _io.push({name: maintenanceDef.id, count: resources.maintenance});
            }
        }
        if(resources.electricity && !exisingItems.has('Electricity'))
            _io.push({name: 'Electricity', count: resources.electricity});
        if(resources.computing && !exisingItems.has('Computing'))
            _io.push({name: 'Computing', count: resources.computing});
        if(resources.unity && !exisingItems.has('Upoints'))
            _io.push({name: 'Upoints', count: resources.unity});

        if(!_io.length) {
            return undefined;
        }
        let hasCustomIo = false;
        let hasCommonIo = false;
        const commonIo = new Set([
            'Electricity',
            'Computing',
            'Upoints',
            'MaintenanceT1',
            'MaintenanceT2',
            'MaintenanceT3',
            'Worker',
        ]);
        for(const i of _io) {
            productsUsedInRecipes.add(i.name);
            const isCommonIo = commonIo.has(i.name);
            let flags = GameRecipeIOFlags.None;
            if(isCommonIo && resources.isInput) {
                flags |= (GameRecipeIOFlags.HideInMenu | GameRecipeIOFlags.HideOnWindow);
            }
            if(i.name === 'Worker') {
                flags |= GameRecipeIOFlags.RoundToCeil;
            }
            if(flags) {
                i.flags = flags;
            }
            if(isCommonIo) {
                hasCommonIo = true;
            } else {
                hasCustomIo = true;
            }
        }
        return {
            io: _io,
            hasCustomIo,
            hasCommonIo,
        };
    };

    const mapRecipe = function(building: BuildingDef, recipe: RecipeDef): GameRecipeSerialized {
        let input = mapIo(recipe.inputs, {
            workers: building.workers,
            maintenanceType: building.maintenance_cost_units,
            maintenance: building.maintenance_cost_quantity,
            electricity: building.electricity_consumed,
            computing: building.computing_consumed,
            unity: building.unity_cost,
            isInput: true,
        });
        let output = mapIo(recipe.outputs, {
            electricity: building.electricity_generated,
            computing: building.computing_generated,
            isInput: false,
        });
        if(!input?.hasCustomIo && !output?.io?.length) {
            //remove insignificant factories
            input = undefined;
            output = undefined;
        }
        const _recipe: GameRecipeSerialized = {
            name: recipe.id,
            input: input?.io,
            output: output?.io,
            time: recipe.duration,
        };
        return _recipe;
    };

    const simpleFactories = new Map<string, GameItemSerialized>();
    const nextTier: NextTier[] = [];
    const brokenTiers: Record<string, string> = {
        SmeltingFurnaceT2: 'ArcFurnace',
        CoolingTowerT1: 'CoolingTowerT2',
        DistillationTowerT1: 'DistillationTowerT2',
        DistillationTowerT2: 'DistillationTowerT3',
        GlassMakerT1: 'GlassMakerT2',
        TurbineLowPress: 'TurbineLowPressT2',
        TurbineHighPress: 'TurbineHighPressT2',
        MaintenanceDepotT1: 'MaintenanceDepotT2',
        MaintenanceDepotT2: 'MaintenanceDepotT3',
        PowerGeneratorT1: 'PowerGeneratorT2',
        ResearchLab2: 'ResearchLab3',
        ResearchLab3: 'ResearchLab4',
        ResearchLab4: 'ResearchLab5',
    };

    for(const building of machines.machines_and_buildings) {
        if(productIds.has(building.id)) {
            throw new Error(`conflict of product/building id: (${building.id})`);
        }
        if(buildingIds.has(building.id)) {
            console.warn(`duplicate building id: (${building.id})`);
            continue;
        }
        buildingIds.add(building.id);

        let recipes = ((building.recipes && building.recipes.length) ? building.recipes : [{
            id: building.id,
            name: building.name,
            duration: 20,
            inputs: [],
            outputs: [],
        }]).map((recipe) => mapRecipe(building, recipe));
        recipes = recipes.filter((r) => (r.input?.length || r.output?.length));
        if(!recipes.length) {
            console.log(`No recipes for building ${building.id}`);
            continue;
        }

        const recipeDictionary: GameRecipeDictionarySerialized = {
            name: building.id,
            recipes,
        };
        recipeDictionaries.push(recipeDictionary);

        const factory: GameItemSerialized = {
            name: building.id,
            label: building.name,
            image: building.id,
            recipe: {
                recipeDictionary: building.id,
            },
        };
        simpleFactories.set(factory.name, factory);

        //fix broken data
        let nextTierName = building.next_tier;
        const nextBrokenTier = brokenTiers[factory.name];
        if(nextBrokenTier) {
            nextTierName = nextBrokenTier;
        }
        if(nextTierName) {
            nextTier.push({
                name: factory.name,
                nextTier: nextTierName,
            });
        }
    }

    return {
        productsUsedInRecipes,
        recipeDictionaries,
        simpleFactories,
        nextTier,
    };
}

function splitFactoriesToTiers(simpleFactories: Map<string, GameItemSerialized>, nextTier: NextTier[]) {
    type TierFactory = {
        name: string;
        next?: TierFactory;
        prev?: TierFactory;
    };

    const tierFactories = new Map<string, TierFactory>();
    for(const tier of nextTier) {
        let thisFactory = tierFactories.get(tier.name);
        if(!thisFactory) {
            thisFactory = {
                name: tier.name,
            };
            tierFactories.set(tier.name, thisFactory);
        }
        let nextFactory = tierFactories.get(tier.nextTier);
        if(!nextFactory) {
            nextFactory = {
                name: tier.nextTier,
            };
            tierFactories.set(tier.nextTier, nextFactory);
        }
        if(thisFactory.next) {
            console.error(`broken tier chain: (${tier.name}) -> (${tier.nextTier})`);
        }
        thisFactory.next = nextFactory;
        if(nextFactory.prev) {
            console.error(`broken tier chain: (${tier.name}) -> (${tier.nextTier})`);
        }
        nextFactory.prev = thisFactory;
    }

    const tierFactoriesArray: GameItemSerialized[][] = [];
    for(const tierFactory of tierFactories.values()) {
        //only roots
        if(tierFactory.prev) {
            continue;
        }
        if(!tierFactory.next) {
            console.warn(`broken tier chain for factory: (${tierFactory.name})`);
            continue;
        }

        //will be sorted by tier
        const tierChainArray: GameItemSerialized[] = [];
        let tier = 0;
        for(let factory: TierFactory | undefined = tierFactory; factory; factory = factory.next) {
            const _factory = simpleFactories.get(factory.name);
            if(_factory) {
                simpleFactories.delete(factory.name);
                tierChainArray.push(_factory);
                //factory name will be lost when keys are applied
                _factory.longName = factory.name;
                const exdata: GameItemExData = {
                    ...(factory.next ? {nextTier: factory.next.name} : {}),
                    ...(factory.prev ? {prevTier: factory.prev.name} : {}),
                    tier,
                };
                _factory.exdata = exdata;
            }
            tier++;
        }
        tierFactoriesArray.push(tierChainArray);
    }

    //push all untiered factories
    for(const factory of simpleFactories.values()) {
        tierFactoriesArray.push([factory]);
    }
    return tierFactoriesArray;
}

function prepareProducts(productIdsToDefs: Map<string, ProductDef>, productsUsedInRecipes: Set<string>) {
    const items: GameItemSerialized[] = [];
    for(const product of productsUsedInRecipes) {
        const def = productIdsToDefs.get(product);
        if(!def)
            throw new Error(`unknown product name: (${product})`);
        const item: GameItemSerialized = {
            name: def.id,
            label: def.name,
            image: def.id,
            type: itemTypes[def.id] || classTypes[def.type],
        };
        const exType = itemExTypes[def.id];
        if(exType) {
            //item id will be lost after key processing, so we keep exType
            const exdata: GameItemExData = {
                exType,
            };
            item.exdata = exdata;
        }
        items.push(item);
    }
    return items;
}
