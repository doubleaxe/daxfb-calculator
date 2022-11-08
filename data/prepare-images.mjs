
import fs from 'node:fs/promises';
import path from 'node:path';
import util from 'node:util';
import Jimp from 'jimp';

export class ImagesList {
    #images = new Map();

    constructor() {
    }
    async addImageFileAsync(imagePath) {
        const imageName = path.basename(imagePath, path.extname(imagePath));
        const imageObject = await Jimp.read(imagePath);
        this.#images.set(imageName, imageObject);
    }
    addImageObject(imageName, imageObject) {
        this.#images.set(imageName, imageObject);
    }
    getImageObject(imageName) {
        return this.#images.get(imageName);
    }
    async saveComposedImageAsync(destPath) {
        const columns = 10;
        const rows = Math.ceil(this.#images.size / columns);

        const width = columns * ImagesList.RESOLUTION;
        const height = rows * ImagesList.RESOLUTION;
        const resultImage = new Jimp(width, height, 0xffffff00, (err) => {
            if(err) throw err;
        });
        let offsetx = 0, offsety = 0;
        for(const [name, imageObject] of this.#images.entries()) {
            resultImage.composite(imageObject, offsetx, offsety, Jimp.BLEND_SOURCE_OVER);
            offsetx = (offsetx + ImagesList.RESOLUTION) % width;
            if(!offsetx)
                offsety += ImagesList.RESOLUTION;
        }
        await resultImage.writeAsync(destPath);
    }

    static async parseAndBuildImagesAsync(jsonPath, baseImages) {
        const derivedImages = new ImagesList();
        const jsonFile = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
        const images = jsonFile.Objects[0].Images;

        const notFound = new Set();
        for(const image of images) {
            const baseImage = baseImages.getImageObject(image.Base);
            let derivedImage = null;
            if(baseImage) {
                derivedImage = baseImage.clone();
            } else {
                notFound.add(image.Base);
                continue;
            }
            if(image.AddMask) {
                const mask = baseImages.getImageObject(image.AddMask);
                if(mask)
                    derivedImage.composite(mask, 0, 0, {mode: Jimp.BLEND_SOURCE_OVER});
                else {
                    notFound.add(image.AddMask);
                }
            }
            if(image.MulMask) {
                const mask = baseImages.getImageObject(image.MulMask);
                if(mask) {
                    this.#applyMask(derivedImage, mask);
                } else {
                    notFound.add(image.MulMask);
                }
            }
            derivedImages.addImageObject(image.NewName, derivedImage);
        }
        if(notFound.size) {
            console.log(`images not found: ${[... notFound].sort().join(',')}`);
        }
        return derivedImages;
    }
    static #applyMask(image, mask) {
        const original = image.clone();
        image.composite(mask, 0, 0, {mode: Jimp.BLEND_MULTIPLY});
        //reapply transparent pixels of original image
        for (const { idx } of original.scanIterator(0, 0, original.bitmap.width, original.bitmap.height)) {
            const alpha = original.bitmap.data[idx + 3];
            image.bitmap.data[idx + 3] = alpha;
        }

        /*
        const bitmask = image.clone().color(
            ['red', 'green', 'blue'].map((c) => ({apply: c, params: [-0xff]}))
        );
        image.mask(bitmask, 0, 0);
        */
    }
}
ImagesList.RESOLUTION = 32;
