
import fs from 'node:fs/promises';
import path from 'node:path';
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
        if(this.#images.has(imageName))
            console.warn(`Duplicate image name: ${imageName}`);
        this.#images.set(imageName, imageObject);
    }
    getImageObject(imageName) {
        return this.#images.get(imageName);
    }
    async saveComposedImageAsync({imagePath, cssPath, jsonPath}, usableImages) {
        const columns = 10;
        const rows = Math.ceil(this.#images.size / columns);

        const cssContent = [];
        const jsonContent = {};
        const width = columns * ImagesList.RESOLUTION;
        const height = rows * ImagesList.RESOLUTION;
        const resultImage = new Jimp(width, height, 0xffffff00, (err) => {
            if(err) throw err;
        });
        let offsetx = 0, offsety = 0;
        for(const [name, imageObject] of this.#images.entries()) {
            if(!usableImages.has(name))
                continue;
            usableImages.delete(name);
            const imgx = offsetx * ImagesList.RESOLUTION, imgy = offsety * ImagesList.RESOLUTION;
            resultImage.composite(imageObject, imgx, imgy, Jimp.BLEND_SOURCE_OVER);
            cssContent.push(`.${name} {background-position: ${-imgx}px ${-imgy}px;}`);
            jsonContent[name] = [offsetx, offsety];
            offsetx = (offsetx + 1) % columns;
            if(!offsetx)
                offsety += 1;
        }
        if(usableImages.size) {
            console.log(`Images not created: ${[...usableImages].sort().join(',')}`);
        }
        resultImage.crop(0, 0, width, (offsety + 1) * ImagesList.RESOLUTION);
        await resultImage.writeAsync(imagePath);
        if(cssPath)
            await fs.writeFile(cssPath, cssContent.join('\n'));
        if(jsonPath)
            await fs.writeFile(jsonPath, JSON.stringify(jsonContent));
    }
    mergeList(...imageLists) {
        for(const imageList of imageLists) {
            imageList.#images.forEach((value, key) => {
                if(this.#images.has(key))
                    console.warn(`Duplicate image name: ${key}`);
                this.#images.set(key, value);
            });
        }
    }

    static async parseAndBuildImagesAsync(jsonPath, baseImages) {
        const derivedImages = new ImagesList();
        const jsonFile = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
        for(const object of jsonFile.Objects) {
            this.#_parseAndBuildImages(baseImages, derivedImages, object.Images);
        }
        return derivedImages;
    }
    static #_parseAndBuildImages(baseImages, derivedImages, images) {
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
            console.log(`images not found: ${[...notFound].sort().join(',')}`);
        }
        return derivedImages;
    }
    static #applyMask(image, mask) {
        const original = image.clone();
        image.composite(mask, 0, 0, {mode: Jimp.BLEND_MULTIPLY});
        //reapply transparent pixels of original image
        for(const {idx} of original.scanIterator(0, 0, original.bitmap.width, original.bitmap.height)) {
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
