/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as path from 'node:path';
import * as fs from 'node:fs';
import {ImageProcessor} from '../../image-processor';
import type {
    GameDataSerialized,
    GameItemCostSerialized,
    GameItemSerialized,
    GameLogisticSerialized,
    GameLogisticTransportSerialized,
    GameRecipeDictionarySerialized,
    GameRecipeIOSerialized,
    GameRecipeSerialized,
} from '#types/game-data-serialized';
//using relative path, without #types, because it is compiled into js, and not handled by typescript only
import {GameItemType, GameRecipeIOFlags} from '../../../site/data/types/constants';
import {type GameItemExData, GameItemExType} from '../types/custom-game-data';
import type {
    MachinesAndBuildingsJson,
    IODef,
    ProductsJson,
    ProductDef,
    BuildingDef,
    RecipeDef,
    ContractsJson,
    TransportsJson,
    BuildCost,
} from './coi-types';
import {ColorActionName} from '@jimp/plugin-color';

//npx ts-node grab-data.ts
//npx ts-node data/coi/grabber/grab-data.ts
//node --loader ts-node/esm --inspect-brk grab-data.ts
const _dirname = __dirname;
const _target = path.join(_dirname, '../parsed');
const _static = path.join(_dirname, '../static/images');
const _images = path.join(_dirname, './captain-of-data/images');
const _coi = path.join(_dirname, './captain-of-data/data');

const machines = JSON.parse(fs.readFileSync(path.join(_coi, 'machines_and_buildings.json'), 'utf8')) as MachinesAndBuildingsJson;
const products = JSON.parse(fs.readFileSync(path.join(_coi, 'products.json'), 'utf8')) as ProductsJson;
const contracts = JSON.parse(fs.readFileSync(path.join(_coi, 'contracts.json'), 'utf8')) as ContractsJson;
const transports = JSON.parse(fs.readFileSync(path.join(_coi, 'transports.json'), 'utf8')) as TransportsJson;

function cleanProductId(id: string) {
    if(id.indexOf('Product_') == 0)
        id = id.substring('Product_'.length);
    if(id.indexOf('Virtual_') == 0)
        id = id.substring('Virtual_'.length);
    return id;
}

const classTypes: {[key: string]: GameItemType} = {
    VirtualProductProto: GameItemType.Special,
    CountableProductProto: GameItemType.Countable,
    LooseProductProto: GameItemType.Loose,
    MoltenProductProto: GameItemType.Molten,
    FluidProductProto: GameItemType.Fluid,
};

type AnyProduct = {
    name: string;
    icon: string;
    type: GameItemType;
    //type2 for storages
    type2: string;
};

const anyProducts: Record<string, AnyProduct> = {
    AnyVirtualProduct: {
        name: 'Any Virtual Product',
        icon: 'Virtual',
        type: GameItemType.Special,
        type2: 'VirtualProductProto',
    },
    AnyCountableProduct: {
        name: 'Any Countable Product',
        icon: 'Countable',
        type: GameItemType.Countable,
        type2: 'CountableProductProto',
    },
    AnyLooseProduct: {
        name: 'Any Loose Product',
        icon: 'Loose',
        type: GameItemType.Loose,
        type2: 'LooseProductProto',
    },
    AnyMoltenProduct: {
        name: 'Any Molten Product',
        icon: 'Molten',
        type: GameItemType.Molten,
        type2: 'MoltenProductProto',
    },
    AnyFluidProduct: {
        name: 'Any Fluid Product',
        icon: 'Fluid',
        type: GameItemType.Fluid,
        type2: 'FluidProductProto',
    },
};
const anyProductsByType = new Map<string, string>(
    Object.entries(anyProducts).map(([key, value]) => [value.type2, key]),
);

const whiteImages: Set<string> = new Set([
    'Anesthetics',
    'Antibiotics',
    'BasicServerRack',
    //'Computing',
    'ConstructionParts',
    'ChickenCarcass',
    'LabEquipment',
    'MaintenanceT1',
    'MechPower',
    'MedicalEquipment',
    'MedicalSupplies',
    'Morphine',
    'Paper',
    'Salt',
    //'SiliconWafer',
    'Upoints',
    'VehicleParts',
    //'Worker',

    'AnyCountableProduct',
    'AnyFluidProduct',
    'AnyVirtualProduct',
    'AnyLooseProduct',
    'AnyMoltenProduct',
    'Research',
    'AnyVirtualStorage',
]);


(async function() {
    applyCustomProducts();

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

function applyCustomProducts() {
    //add our custom products
    products.products.push({
        id: 'Worker',
        name: 'Worker',
        icon: 'Worker',
        type: 'VirtualProductProto',
    });
    products.products.push({
        id: 'Research',
        name: 'Research',
        icon: 'Research',
        type: 'VirtualProductProto',
    });
    for(const [id, any] of Object.entries(anyProducts)) {
        products.products.push({
            id: id,
            name: any.name,
            icon: any.icon,
            type: any.type2,
        });
    }
}

function dirToMapCaseInsensitive(dir: string) {
    const files = fs.readdirSync(dir);
    const map = new Map<string, string>();
    if(!files || !files.length)
        return {dir, map};
    for(const file of files) {
        map.set(file.toLowerCase(), file);
    }
    return {dir, map};
}

async function prepareImages(productIdsToDefs: Map<string, ProductDef>, items: GameItemSerialized[]) {
    type ImageDef = {
        id: string;
        icon: string;
        alt: string[];
        dir: ReturnType<typeof dirToMapCaseInsensitive>;
    };

    const buildingsDir = dirToMapCaseInsensitive(path.join(_images, 'buildings'));
    const productsDir = dirToMapCaseInsensitive(path.join(_images, 'products'));
    const staticDir = dirToMapCaseInsensitive(_static);
    const imagesPaths: ImageDef[] = [];
    const overrides: Record<string, string> = {
        Antibiotics: 'Penicillin',
        ChilledWater: 'WaterChilled',
        Compost: 'Digestate',
        ConstructionParts: 'ConstructionParts1',
        Electronics: 'Electronics1',
        Fruit: 'Fruits',
        HeavyOil: 'OilHeavy',
        ImpureCopper: 'CopperImpure',
        IronOreCrushed: 'IronCrushed',
        LabEquipment: 'LabEquipment1',
        LightOil: 'OilLight',
        MechPower: 'MechanicalPower',
        MediumOil: 'OilMedium',
        Microchips: 'Microchip',
        MicrochipsStage1A: 'MicrochipWafer1A',
        MicrochipsStage1B: 'MicrochipWafer1B',
        MicrochipsStage1C: 'MicrochipWafer1C',
        MicrochipsStage2A: 'MicrochipWafer2A',
        MicrochipsStage2B: 'MicrochipWafer2B',
        MicrochipsStage2C: 'MicrochipWafer2C',
        MicrochipsStage3A: 'MicrochipWafer3A',
        MicrochipsStage3B: 'MicrochipWafer3B',
        MicrochipsStage3C: 'MicrochipWafer3C',
        MicrochipsStage4A: 'MicrochipWafer4A',
        MicrochipsStage4B: 'MicrochipWafer4B',
        MoltenCopper: 'CopperMolten',
        MoltenGlass: 'GlassMolten',
        MoltenIron: 'IronMolten',
        MoltenSilicon: 'SiliconMolten',
        MoltenSteel: 'SteelMolten',
        Potato: 'Potato128',
        PolySilicon: 'Silicon',
        Recyclables: 'MetalScrap128',
        SiliconWafer: 'MonoWafer',
        SteamDepleted: 'SteamDepleated',
        SteamHi: 'SteamHp',
        UraniumDepleted: 'DepletedUranium',
        UraniumEnriched: 'UraniumEnriched4Perc',
        UraniumEnriched20: 'UraniumEnriched20Perc',
        UraniumReprocessed: 'ReprocessedUranium',
        VehicleParts: 'VehicleParts1',
    };

    for(const item of items) {
        if(item.recipe) {
            imagesPaths.push({
                id: item.name,
                icon: item.name + '.png',
                alt: [],
                dir: buildingsDir,
            });
        } else {
            //TODO - migrate icons to internal game asset names
            const iconName = item.name;
            const alt = [];
            const overrideName = overrides[item.name];
            if(overrideName) {
                alt.push(overrideName + '.png');
            }
            const def = productIdsToDefs.get(item.name);
            if(def?.icon) {
                alt.push(def.icon + '.png');
            }
            imagesPaths.push({
                id: item.name,
                icon: iconName + '.png',
                alt,
                dir: productsDir,
            });
        }
    }

    const usedImages = new Set<string>();
    const imageProcessor = new ImageProcessor(32);
    imagesPaths.sort((a, b) => a.id.localeCompare(b.id));
    for(const image of imagesPaths) {
        let realImageName = image.dir.map.get(image.icon.toLowerCase());
        let imagePath: string | undefined;
        if(realImageName) {
            imagePath = path.join(image.dir.dir, realImageName);
        } else {
            for(const altName of image.alt) {
                realImageName = image.dir.map.get(altName.toLowerCase());
                if(realImageName) {
                    imagePath = path.join(image.dir.dir, realImageName);
                    break;
                }
            }
        }
        if(realImageName) {
            usedImages.add(realImageName);
        }
        if(!imagePath) {
            realImageName = staticDir.map.get(image.icon.toLowerCase());
            if(realImageName) {
                imagePath = path.join(staticDir.dir, realImageName);
            }
        }
        if(!imagePath) {
            console.warn(`Image not found: ${path.join(image.dir.dir, image.icon)}`);
            continue;
        }
        try {
            const imageBuffer = fs.readFileSync(imagePath);
            const img = await imageProcessor.addImageBuffer(imageBuffer, image.id);
            if(whiteImages.has(image.id)) {
                img.color([{apply: ColorActionName.SHADE, params: [40]}]);
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
        recipeDictionaries,
        simpleFactories,
        nextTier,
    } = prepareFactories(productNamesToDefs, productIds);

    addSpecialBuildings(productNamesToDefs, simpleFactories, recipeDictionaries);

    const productsUsedInRecipes = recipeDictionaries.map(({recipes}) => (
        recipes.map(({input, output}) => (
            (input?.map(({name}) => name) || []).concat(output?.map(({name}) => name) || [])
        ))
    )).flat(3);
    const productsUsedInBuildings = [...simpleFactories.values()].map(
        ({cost}) => (cost?.map(({name}) => name) || []),
    ).flat();

    const productsUsedInEverything = new Set<string>(productsUsedInRecipes.concat(productsUsedInBuildings));

    const tierFactoriesArray = splitFactoriesToTiers(simpleFactories, nextTier);
    const productsArray = prepareProducts(productIdsToDefs, productsUsedInEverything);
    const {
        logistic,
        logisticItemsArray,
    } = prepareLogistic();

    //sort by name, but take tier chains into account
    const resultItems = tierFactoriesArray.concat(
        productsArray.map((p) => [p]),
        logisticItemsArray,
    );

    resultItems.sort((a, b) => (a[0]?.label?.localeCompare(b[0]?.label || '') || 0));

    const items: GameItemSerialized[] = resultItems.flat();

    const gameData: Partial<GameDataSerialized> = {
        recipeDictionaries,
        items,
        logistic,
    };
    fs.writeFileSync(path.join(_target, 'data.json'), JSON.stringify(gameData, null, 2));
    return gameData;
}

function prepareFactories(productNamesToDefs: Map<string, ProductDef>, productIds: Set<string>) {
    const buildingIds = new Set<string>();

    const recipeDictionaries: GameRecipeDictionarySerialized[] = [];

    type AdditionalResources = {
        workers?: number;
        maintenanceType?: string;
        maintenance?: number;
        electricity?: number;
        computing?: number;
        unity?: number;
        research?: number;
        product_type?: string;
        isInput: boolean;
    };
    const commonIo = new Set([
        'Electricity',
        'Computing',
        'Upoints',
        'MaintenanceT1',
        'MaintenanceT2',
        'MaintenanceT3',
        'Worker',
        'Research',
    ]);

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
            //wiki says idle buildings consume 30% of maintenance.
            //it is too hard to solve, so we just assume maintenance is scaled with building count
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
        if(resources.research && !exisingItems.has('Research'))
            _io.push({name: 'Research', count: resources.research});

        if(!_io.length) {
            return undefined;
        }
        let hasCustomIo = false;
        let hasCommonIo = false;
        for(const i of _io) {
            const isCommonIo = commonIo.has(i.name);
            let flags = GameRecipeIOFlags.None;
            if(isCommonIo && resources.isInput) {
                flags |= (GameRecipeIOFlags.HideInMenu | GameRecipeIOFlags.HideOnWindow);
            }
            if(isCommonIo && (i.name === 'Worker')) {
                //just for not showing 3.5 workers when building count is not integer
                //workers don't scale with partial (idle) building count
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

    const mapRecipe = function(building: BuildingDef, recipe: RecipeDef): GameRecipeSerialized[] {
        const input = mapIo(recipe.inputs, {
            workers: building.workers,
            maintenanceType: building.maintenance_cost_units,
            maintenance: building.maintenance_cost_quantity,
            electricity: building.electricity_consumed,
            computing: building.computing_consumed,
            unity: building.unity_cost,
            isInput: true,
        });
        const output = mapIo(recipe.outputs, {
            electricity: building.electricity_generated,
            computing: building.computing_generated,
            research: building.research_speed,
            isInput: false,
        });

        //storages are treated specially
        if(building.product_type) {
            const anyItemId = anyProductsByType.get(building.product_type);
            if(!anyItemId)
                throw new Error(`unknown product type: (${building.product_type})`);
            let anyItem = [{name: anyItemId, count: 100}];
            if(building.id == 'NuclearWasteStorage') {
                anyItem = [{name: 'SpentFuel', count: 100}];
            }

            const recipes = [];
            const _recipe1: GameRecipeSerialized = {
                name: recipe.id + 'In',
                input: (input?.io || []).concat(anyItem),
                output: output?.io,
                time: 60,
            };
            recipes.push(_recipe1);

            if(building.id != 'NuclearWasteStorage') {
                const _recipe2: GameRecipeSerialized = {
                    name: recipe.id + 'Out',
                    input: input?.io,
                    output: (output?.io || []).concat(anyItem),
                    time: 60,
                };
                recipes.push(_recipe2);
                const _recipe3: GameRecipeSerialized = {
                    name: recipe.id + 'InOut',
                    input: (input?.io || []).concat(anyItem),
                    output: (output?.io || []).concat(anyItem),
                    time: 60,
                };
                recipes.push(_recipe3);
            }
            return recipes;
        }

        if(!input?.hasCustomIo && !output?.io?.length) {
            //remove insignificant factories
            return [];
        }
        const _recipe: GameRecipeSerialized = {
            name: recipe.id,
            input: input?.io,
            output: output?.io,
            time: recipe.duration,
        };
        return [_recipe];
    };

    const mapCost = function(cost: BuildCost): GameItemCostSerialized {
        const def = productNamesToDefs.get(cost.product);
        if(!def)
            throw new Error(`unknown product name: (${cost.product})`);
        return {
            name: def.id,
            count: cost.quantity,
        };
    };

    const simpleFactories = new Map<string, GameItemSerialized>();
    const nextTier: NextTier[] = [];
    const brokenTiers: Record<string, string> = {
        SmeltingFurnaceT2: 'ArcFurnace',
        ArcFurnace: 'ArcFurnace2',
        CoolingTowerT1: 'CoolingTowerT2',
        //DistillationTowerT1: 'DistillationTowerT2',
        //DistillationTowerT2: 'DistillationTowerT3',
        GlassMakerT1: 'GlassMakerT2',
        MaintenanceDepotT1: 'MaintenanceDepotT2',
        MaintenanceDepotT2: 'MaintenanceDepotT3',
        PowerGeneratorT1: 'PowerGeneratorT2',
    };
    const ignoredFactories = new Set<string>([
        'BasicServerRack',
        //too many storages are unnecessary
        'StorageUnitT4',
        'StorageUnitT3',
        'StorageUnitT2',
        'StorageLooseT4',
        'StorageLooseT3',
        'StorageLooseT2',
        'StorageFluidT4',
        'StorageFluidT3',
        'StorageFluidT2',
    ]);

    for(const building of machines.machines_and_buildings) {
        if(ignoredFactories.has(building.id))
            continue;
        if(productIds.has(building.id)) {
            throw new Error(`conflict of product/building id: (${building.id})`);
        }
        if(buildingIds.has(building.id)) {
            console.warn(`duplicate building id: (${building.id})`);
            continue;
        }
        buildingIds.add(building.id);

        const recipes = ((building.recipes && building.recipes.length) ? building.recipes : [{
            id: building.id,
            name: building.name,
            duration: 20,
            inputs: [],
            outputs: [],
        }]).map((recipe) => mapRecipe(building, recipe)).flat();
        if(!recipes.length) {
            console.log(`No recipes for building ${building.id}`);
            continue;
        }

        const recipeDictionary: GameRecipeDictionarySerialized = {
            name: building.id,
            recipes,
        };
        recipeDictionaries.push(recipeDictionary);

        const costs = building.build_costs.map(mapCost);
        const factory: GameItemSerialized = {
            name: building.id,
            label: building.name,
            image: building.id,
            recipe: {
                recipeDictionary: building.id,
            },
            cost: costs.length ? costs : undefined,
        };
        simpleFactories.set(factory.name, factory);

        //fix broken data
        let nextTierName = building.next_tier;
        const nextBrokenTier = brokenTiers[factory.name];
        if(nextBrokenTier !== undefined) {
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
        recipeDictionaries,
        simpleFactories,
        nextTier,
    };
}

function addSpecialBuildings(
    productNamesToDefs: Map<string, ProductDef>,
    simpleFactories: Map<string, GameItemSerialized>,
    recipeDictionaries: GameRecipeDictionarySerialized[],
) {
    let item: GameItemSerialized;
    let recipeDictionary: GameRecipeDictionarySerialized;
    let io: GameRecipeIOSerialized;

    //virtual storage
    item = {
        name: 'AnyVirtualStorage',
        label: 'Any Virtual Product Storage',
        image: 'AnyVirtualStorage',
    };
    item.recipe = {
        recipeDictionary: item.name,
    };

    io = {
        name: 'AnyVirtualProduct',
        count: 100,
    };
    recipeDictionary = {
        name: item.name,
        recipes: [{
            name: item.name + 'In',
            input: [io],
            output: [],
            time: 60,
        }, {
            name: item.name + 'Out',
            input: [],
            output: [io],
            time: 60,
        }, {
            name: item.name + 'InOut',
            input: [io],
            output: [io],
            time: 60,
        }],
    };
    simpleFactories.set(item.name, item);
    recipeDictionaries.push(recipeDictionary);

    //molten storage
    item = {
        name: 'AnyMoltenStorage',
        label: 'Any Molten Product Storage',
        image: 'AnyMoltenStorage',
    };
    item.recipe = {
        recipeDictionary: item.name,
    };

    io = {
        name: 'AnyMoltenProduct',
        count: 100,
    };
    recipeDictionary = {
        name: item.name,
        recipes: [{
            name: item.name + 'In',
            input: [io],
            output: [],
            time: 60,
        }, {
            name: item.name + 'Out',
            input: [],
            output: [io],
            time: 60,
        }, {
            name: item.name + 'InOut',
            input: [io],
            output: [io],
            time: 60,
        }],
    };
    simpleFactories.set(item.name, item);
    recipeDictionaries.push(recipeDictionary);

    //transform contracts into special building
    item = {
        name: 'Contract',
        label: 'Contract',
        image: 'Contract',
    };
    item.recipe = {
        recipeDictionary: item.name,
    };
    recipeDictionary = {
        name: item.name,
        recipes: [],
    };
    for(const contract of contracts.contracts) {
        const input = productNamesToDefs.get(contract.product_to_pay_with_name);
        const output = productNamesToDefs.get(contract.product_to_buy_name);
        if(!input || !output) {
            throw new Error(`unknown contract: (${contract.product_to_pay_with_name} ${contract.product_to_buy_name})`);
        }
        //we don't use contract.unity_per_month here, because we cannot solve such counts
        const unity = contract.unity_per_100_bought;
        const inputCount = (contract.product_to_pay_with_quantity * 100) / contract.product_to_buy_quantity;
        const recipe: GameRecipeSerialized = {
            name: contract.id,
            input: [{
                name: input.id,
                count: inputCount,
            }, {
                name: 'Upoints',
                count: unity,
                flags: (GameRecipeIOFlags.HideInMenu | GameRecipeIOFlags.HideOnWindow),
            }],
            output: [{
                name: output.id,
                count: 100,
            }],
            time: 60,
        };
        recipeDictionary.recipes.push(recipe);
    }
    simpleFactories.set(item.name, item);
    recipeDictionaries.push(recipeDictionary);
}

type TierChainDef = {
    name: string;
    next?: TierChainDef;
    prev?: TierChainDef;
};

function splitFactoriesToTiers(simpleFactories: Map<string, GameItemSerialized>, nextTier: NextTier[]) {
    //this fix is for some strange building, which should be sorted according to tiers
    //but should be upgraded other ways, because of recipes in them
    const fixFactoryTiers: Record<string, {nextTier?: string | false; prevTier?: string | false}> = {
        SmeltingFurnaceT2: {
            nextTier: 'ArcFurnace2',
        },
        ArcFurnace: {
            prevTier: false,
            nextTier: false,
        },
        ArcFurnace2: {
            prevTier: 'SmeltingFurnaceT2',
        },
    };
    return splitItemsToTiers(simpleFactories, nextTier, (_factory, factory, tier) => {
        let prev = fixFactoryTiers[_factory.name]?.prevTier;
        if(prev === undefined) {
            prev = factory.prev?.name;
        }
        if(prev) {
            _factory.prevTier = prev;
        }
        let next = fixFactoryTiers[_factory.name]?.nextTier;
        if(next === undefined) {
            next = factory.next?.name;
        }
        if(next) {
            _factory.nextTier = next;
        }
        const exdata: GameItemExData = {
            tier,
        };
        _factory.exdata = exdata;
    });
}

function splitItemsToTiers<TierItem>(
    simpleFactories: Map<string, TierItem>,
    nextTier: NextTier[],
    processTierItem?: (tierItem: TierItem, chainDef: TierChainDef, tier: number) => void,
) {
    const tierFactories = new Map<string, TierChainDef>();
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

    //will be sorted by tier
    const tierFactoriesArray: TierItem[][] = [];
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
        const tierChainArray: TierItem[] = [];
        let tier = 0;
        for(let factory: TierChainDef | undefined = tierFactory; factory; factory = factory.next) {
            const _factory = simpleFactories.get(factory.name);
            if(_factory) {
                simpleFactories.delete(factory.name);
                tierChainArray.push(_factory);
                processTierItem?.(_factory, factory, tier);
                tier++;
            }
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

    //for conveyors
    for(const id of Object.keys(anyProducts)) {
        productsUsedInRecipes.add(id);
    }

    const items: GameItemSerialized[] = [];
    for(const product of productsUsedInRecipes) {
        const def = productIdsToDefs.get(product);
        if(!def)
            throw new Error(`unknown product name: (${product})`);
        const item: GameItemSerialized = {
            name: def.id,
            label: def.name,
            image: def.id,
            type: classTypes[def.type],
        };
        const any = anyProducts[def.id];
        if(any) {
            item.isAbstractClassItem = true;
        }
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

function prepareLogistic() {
    type LogisticGroup = 'FlatConveyor' | 'LooseMaterialConveyor' | 'MoltenMetalChannel' | 'Pipe';
    //our calculator solves everything in items per minute, so we should correct here accordingly
    //we set time to 1 and multipy counts by 60 to get per minute
    const logisticGroups: Record<LogisticGroup, GameLogisticSerialized> = {
        FlatConveyor: {
            name: 'FlatConveyor',
            label: 'Flat conveyor',
            items: [{
                name: 'AnyCountableProduct',
            }],
            transport: [],
            time: 1,
            stackable: true,
        },
        LooseMaterialConveyor: {
            name: 'LooseMaterialConveyor',
            label: 'U-shape conveyor',
            items: [{
                name: 'AnyLooseProduct',
            }],
            transport: [],
            time: 1,
            stackable: true,
        },
        MoltenMetalChannel: {
            name: 'MoltenMetalChannel',
            label: 'Molten channel',
            items: [{
                name: 'AnyMoltenProduct',
            }],
            transport: [],
            time: 1,
            stackable: true,
        },
        Pipe: {
            name: 'Pipe',
            label: 'Pipe',
            items: [{
                name: 'AnyFluidProduct',
            }],
            transport: [],
            time: 1,
            stackable: true,
        },
    };
    const conveyorToProductType: {[key: string]: LogisticGroup} = {
        FlatConveyorT1: 'FlatConveyor',
        FlatConveyorT2: 'FlatConveyor',
        FlatConveyorT3: 'FlatConveyor',
        LooseMaterialConveyor: 'LooseMaterialConveyor',
        LooseMaterialConveyorT2: 'LooseMaterialConveyor',
        LooseMaterialConveyorT3: 'LooseMaterialConveyor',
        MoltenMetalChannel: 'MoltenMetalChannel',
        PipeT1: 'Pipe',
        PipeT2: 'Pipe',
        PipeT3: 'Pipe',
    };

    const mapTransportToItem = function(transport: GameLogisticTransportSerialized) {
        const item: GameItemSerialized = {
            name: transport.name,
            label: transport.label || '',
            image: transport.name,
        };
        return item;
    };

    const nextTier: NextTier[] = [];
    for(const transport of transports.transports) {
        const group = conveyorToProductType[transport.id];
        if(!group) {
            console.warn(`unknown conveyor: (${transport.id})`);
            continue;
        }
        const _logistic = logisticGroups[group];
        const _transport: GameLogisticTransportSerialized = {
            name: transport.id,
            label: transport.name,
            count: transport.throughput_per_second * 60,
        };
        _logistic.transport.push(_transport);

        const nextTierName = transport.next_tier;
        if(nextTierName) {
            nextTier.push({
                name: transport.id,
                nextTier: nextTierName,
            });
        }
    }

    const logistic = [...Object.values(logisticGroups)].filter(l => l.transport.length);
    const logisticItemsArray: GameItemSerialized[][] = [];
    for(const item of logistic) {
        //sort each logistic by tier
        if(item.transport.length <= 1) {
            logisticItemsArray.push(item.transport.map(t => mapTransportToItem(t)));
            continue;
        }
        const transportMap = new Map<string, GameLogisticTransportSerialized>(
            item.transport.map(t => [t.name, t]),
        );
        const splitTransports = splitItemsToTiers(transportMap, nextTier);
        splitTransports.sort((a, b) => (a[0]?.label?.localeCompare(b[0]?.label || '') || 0));
        item.transport = splitTransports.flat();
        logisticItemsArray.push(item.transport.map(t => mapTransportToItem(t)));
    }
    return {
        logistic,
        logisticItemsArray,
    };
}
