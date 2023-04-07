import * as path from 'node:path';
import * as fs from 'node:fs';
import {ImageProcessor} from '../../image-processor';
import machines from './captain-of-data/data/machines_and_buildings.json';
import products from './captain-of-data/data/products.json';

//npx ts-node grab-images.ts
//node --loader ts-node/esm --inspect-brk grab-images.ts
const _dirname = __dirname;
const _target = path.join(_dirname, '../parsed');
const _static = path.join(_dirname, '../static/images');
const _images = path.join(_dirname, './captain-of-data/images');

function productNameToIcon(n: string) {
    let name = n;
    name = name.replaceAll('(', '');
    name = name.replaceAll(')', '');
    name = name.endsWith(' IV') ? name.replaceAll(' IV', '4') : name;
    name = name.endsWith(' V') ? name.replaceAll(' V', '5') : name;
    name = name.endsWith(' III') ? name.replaceAll(' III', '3') : name;
    name = name.endsWith(' II') ? name.replaceAll(' II', '2') : name;
    name = name.endsWith(' I') ? name.replaceAll(' I', '1') : name;
    name = name.replaceAll(' ', '');
    return name;
}

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

(async function() {
    const prodictNamesToIds = new Map<string, string>(products.products.map((p) => [p.name, cleanProductId(p.id)]));
    const productIds = new Set<string>(prodictNamesToIds.values());

    const images = new Map<string, ImageDef>();
    for(const building of machines.machines_and_buildings) {
        if(productIds.has(building.id)) {
            throw new Error(`duplicate product/building name: (${building.id})`);
        }
        images.set(building.id, {id: building.id, name: building.id, icon: 'buildings/' + building.id + '.png'});
        for(const recipe of building.recipes) {
            for(const io of recipe.inputs.concat(recipe.outputs)) {
                const iconName = productNameToIcon(io.name);
                const id = prodictNamesToIds.get(io.name) || iconName;
                images.set(id, {id: id, name: iconName, icon: 'products/' + iconName + '.png'});
            }
        }
    }

    const imageProcessor = new ImageProcessor(64);
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
})().catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
