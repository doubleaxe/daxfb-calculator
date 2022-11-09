
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ImagesList } from './prepare-images.mjs';
import { RecipesList, ItemsList } from './prepare-json.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// /data/games/SteamLibrary/steamapps/common/Evospace/Evospace-Mac-Shipping.app/Contents/UE4/Evospace/Content
(async function() {
    const args = process.argv.slice(2);
    const basePath = args[0];
    if(!basePath)
        throw new Error('Evospace data path is required, e.g. ...steamapps/common/Evospace/Evospace-Mac-Shipping.app/Contents/UE4/Evospace/Content');

    await processJsonAsync(basePath);
    await processImagesAsync(basePath);
})().catch((err) => console.error(err.stack));


async function walkFilesAsync(dir, functionAsync, ...args) {
    const files = await fs.readdir(dir);
    if(!files || !files.length)
        return;
    files.sort();
    for(const file of files) {
        const filePath = path.join(dir, file);
        await functionAsync(filePath, ...args);
    }
}

async function processImagesAsync(basePath) {
    const baseImages = new ImagesList();
    await walkFilesAsync(path.join(basePath, 'Icons'), baseImages.addImageFileAsync.bind(baseImages));

    await walkFilesAsync(path.join(basePath, 'Generated', 'Resources'), async(jsonPath) => {
        const derivedImages = await ImagesList.parseAndBuildImagesAsync(jsonPath, baseImages);
        const fileName = path.basename(jsonPath, path.extname(jsonPath));
        await derivedImages.saveComposedImageAsync(path.join(__dirname, `${fileName}.png`));
    });

    await baseImages.saveComposedImageAsync(path.join(__dirname, '1.png'));
}

async function processJsonAsync(basePath) {
    const recipesList = new RecipesList();

    await walkFilesAsync(path.join(basePath, 'Generated', 'Recipes'), async(jsonPath) => {
        await recipesList.parseJsonFileAsync(jsonPath);
    });

    const itemList = new ItemsList();
    await walkFilesAsync(path.join(basePath, 'Generated', 'Mixed'), async(jsonPath) => {
        await itemList.parseJsonFileAsync(jsonPath);
    });
}
