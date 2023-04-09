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
            if(!def) {
                throw new Error(`Unknown product: ${item.name}`);
            }
            const iconName = def.icon;
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

async function prepareGameData(productNamesToDefs: Map<string, ProductDef>, productIdsToDefs: Map<string, ProductDef>) {
    const productIds = new Set<string>(productIdsToDefs.keys());
    const buildingIds = new Set<string>();

    const recipeDictionaries: GameRecipeDictionarySerialized[] = [];
    const items: GameItemSerialized[] = [];
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
        const originalItems = new Set<string>();
        const _io = (io || []).map((i) => {
            const def = productNamesToDefs.get(i.name);
            if(!def)
                throw new Error(`unknown product name: (${i.name})`);
            originalItems.add(def.id);
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
            if(!originalItems.has(maintenanceDef.id)) {
                _io.push({name: maintenanceDef.id, count: resources.maintenance});
            }
        }
        if(resources.electricity && !originalItems.has('Electricity'))
            _io.push({name: 'Electricity', count: resources.electricity});
        if(resources.computing && !originalItems.has('Computing'))
            _io.push({name: 'Computing', count: resources.computing});
        if(resources.unity && !originalItems.has('Upoints'))
            _io.push({name: 'Upoints', count: resources.unity});

        if(!_io.length) {
            return undefined;
        }
        let hasCustomIo = false;
        let hasCommonIo = false;
        for(const i of _io) {
            productsUsedInRecipes.add(i.name);
            const hasOriginalIo = originalItems.has(i.name);
            if(!hasOriginalIo && ((_io.length > 1) || resources.isInput)) {
                i.flags = GameRecipeIOFlags.HideInMenu | GameRecipeIOFlags.HideOnWindow;
            }
            if(hasOriginalIo) {
                hasCustomIo = true;
            } else {
                hasCommonIo = true;
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
        items.push(factory);
    }

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
    items.sort((a, b) => a.label.localeCompare(b.label));

    const gameData: Partial<GameDataSerialized> = {
        recipeDictionaries,
        items,
    };
    fs.writeFileSync(path.join(_target, 'data.json'), JSON.stringify(gameData, null, 2));
    return gameData;
}
