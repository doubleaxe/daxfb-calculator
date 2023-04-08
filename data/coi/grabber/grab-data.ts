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
} from '#types/game-data-serialized';

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

(async function() {
    const productNamesToDefs = new Map<string, ProductDef>(products.products.map((p) => [p.name, {...p, id: cleanProductId(p.id)}]));
    console.log('Processing images...');
    await prepareImages(productNamesToDefs);
    console.log('Processing game data...');
    await prepareGameData(productNamesToDefs);
})().catch((err) => {
    console.error(err.stack);
    process.exit(1);
});

async function prepareImages(productNamesToDefs: Map<string, ProductDef>) {
    const images = new Map<string, ImageDef>();
    for(const building of machines.machines_and_buildings) {
        images.set(building.id, {id: building.id, name: building.id, icon: 'buildings/' + building.id + '.png'});
        for(const recipe of building.recipes) {
            for(const io of recipe.inputs.concat(recipe.outputs)) {
                const def = productNamesToDefs.get(io.name);
                if(!def)
                    throw new Error(`unknown product name: (${io.name})`);
                const iconName = def.icon;
                const id = def.id;
                images.set(id, {id: id, name: iconName, icon: 'products/' + iconName + '.png'});
            }
        }
    }

    const imageProcessor = new ImageProcessor(32);
    const imagesPaths = [...images.values()];
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
            await imageProcessor.addImageBuffer(imageBuffer, image.id);
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

async function prepareGameData(productNamesToDefs: Map<string, ProductDef>) {
    const productIds = new Set<string>([...productNamesToDefs.values()].map((p) => p.id));
    const buildingIds = new Set<string>();

    const recipeDictionaries: GameRecipeDictionarySerialized[] = [];
    const items: GameItemSerialized[] = [];
    const productsUsedInRecipes = new Set<string>();

    const mapIo = function(io: IODef[] | undefined): GameRecipeIOSerialized[] | undefined {
        if(!io || !io.length) {
            return undefined;
        }
        return io.map((i) => {
            const def = productNamesToDefs.get(i.name);
            if(!def)
                throw new Error(`unknown product name: (${i.name})`);
            productsUsedInRecipes.add(i.name);
            return {
                name: def.id,
                count: i.quantity,
            };
        });
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
        let recipes = building.recipes;
        if(!recipes || !recipes.length) {
            //solar panel
            if(building.electricity_generated) {
                recipes = [{
                    id: building.id,
                    name: building.name,
                    duration: 20,
                    inputs: [],
                    outputs: [{
                        name: 'Electricity',
                        quantity: building.electricity_generated,
                    }],
                }];
            } else {
                console.log(`No recipes for building ${building.id}`);
                continue;
            }
        }
        const recipeDictionary: GameRecipeDictionarySerialized = {
            name: building.id,
            recipes: recipes.map((recipe) => {
                return {
                    name: recipe.id,
                    input: mapIo(recipe.inputs),
                    output: mapIo(recipe.outputs),
                    time: recipe.duration,
                };
            }),
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
        const def = productNamesToDefs.get(product);
        if(!def)
            throw new Error(`unknown product name: (${product})`);
        const item: GameItemSerialized = {
            name: def.id,
            label: def.name,
            image: def.id,
        };
        items.push(item);
    }
    items.sort((a, b) => a.label.localeCompare(b.label));

    const gameData: Partial<GameDataSerialized> = {
        recipeDictionaries,
        items,
    };
    fs.writeFileSync(path.join(_target, 'data.json'), JSON.stringify(gameData, null, 2));
}
