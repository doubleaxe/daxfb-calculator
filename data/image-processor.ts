/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import Jimp from 'jimp';
import type {Font} from '@jimp/plugin-print';
import type {GameImagesSerialized} from '#types/game-data-serialized';

type ImageCollection = {
    image: Jimp;
    references: GameImagesSerialized;
};

const FONT_RESOLUTION: [number, string][] = [
    [128, Jimp.FONT_SANS_128_BLACK],
    [64, Jimp.FONT_SANS_64_BLACK],
    [32, Jimp.FONT_SANS_32_BLACK],
    [16, Jimp.FONT_SANS_16_BLACK],
    [14, Jimp.FONT_SANS_14_BLACK],
    [12, Jimp.FONT_SANS_12_BLACK],
    [10, Jimp.FONT_SANS_10_BLACK],
    [8, Jimp.FONT_SANS_8_BLACK],
];

export class ImageProcessor {
    private readonly RESOLUTION;
    private readonly COLUMNS;
    private readonly _collections: ImageCollection[] = [];
    private readonly _images = new Map<string, Jimp>();
    private readonly _fonts = new Map<number, Font>();

    constructor(RESOLUTION?: number, COLUMNS?: number) {
        this.RESOLUTION = RESOLUTION || 32;
        this.COLUMNS = COLUMNS || 10;
    }

    async addCollectionFile(collectionPath: string, referencesPath: string) {
        return this.addCollectionObject(
            await Jimp.read(collectionPath),
            JSON.parse(await fs.readFile(referencesPath, 'utf8')),
        );
    }
    async addCollectionBuffer(collectionBuffer: Buffer, references: GameImagesSerialized) {
        return this.addCollectionObject(
            await Jimp.read(collectionBuffer),
            references,
        );
    }
    //TODO - split collection into individual images if needed in future
    async addCollectionObject(collectionObject: Jimp, references: GameImagesSerialized) {
        const width = (this.RESOLUTION * this.COLUMNS);
        if((collectionObject.bitmap.height % this.RESOLUTION) || (collectionObject.bitmap.width != width))
            throw new Error('Invalid collection resolution');
        this._collections.push({image: collectionObject, references});
    }
    async addImageFolder(folderPath: string) {
        const files = await fs.readdir(folderPath);
        if(!files || !files.length)
            return;
        files.sort();
        for(const file of files) {
            const filePath = path.join(folderPath, file);
            await this.addImageFile(filePath);
        }
    }
    async addImageFile(imagePath: string, imageName?: string) {
        if(!imageName)
            imageName = path.basename(imagePath, path.extname(imagePath));
        return this.addImageObject(await Jimp.read(imagePath), imageName);
    }
    async addImageBuffer(imageBuffer: Buffer, imageName: string) {
        return this.addImageObject(await Jimp.read(imageBuffer), imageName);
    }
    async addImageObject(imageObject: Jimp, imageName: string) {
        if(this._images.has(imageName))
            console.warn(`Duplicate image name: ${imageName}`);
        if((imageObject.bitmap.height != this.RESOLUTION) || (imageObject.bitmap.width != this.RESOLUTION)) {
            console.warn(`Invalid image resolution: ${imageObject.bitmap.width} x ${imageObject.bitmap.height} => ${imageName}`);
            imageObject.resize(this.RESOLUTION, this.RESOLUTION, Jimp.RESIZE_BEZIER);
        }
        this._images.set(imageName, imageObject);
        return imageObject;
    }
    async addPlaceholderImage(letters: string, imageName: string) {
        const letterSize = Math.floor(this.RESOLUTION / letters.length);
        const fontData = FONT_RESOLUTION.find(([size]) => (size <= letterSize));
        if(!fontData)
            throw new Error(`Unsupported font size, text too large: ${letters}`);
        const [fontSize, fontName] = fontData;
        let font = this._fonts.get(fontSize);
        if(!font) {
            font = await Jimp.loadFont(fontName);
            this._fonts.set(fontSize, font);
        }

        const yoffset = (this.RESOLUTION - fontSize) >> 1;
        const width = Jimp.measureText(font, letters);
        const xoffset = (this.RESOLUTION - width) >> 1;

        const placeholderImage = new Jimp(this.RESOLUTION, this.RESOLUTION, 0xffffff00);
        placeholderImage.print(font, xoffset, yoffset, letters);
        return await this.addImageObject(placeholderImage, imageName);
    }
    async composeImage() {
        const width = (this.RESOLUTION * this.COLUMNS);
        const rows1 = Math.round(this._collections.reduce((height, {image}) => height + image.bitmap.height, 0) / this.RESOLUTION);
        const rows2 = Math.ceil(this._images.size / this.COLUMNS);

        const rows = rows1 + rows2;
        const height = rows * this.RESOLUTION;

        const resultImage = new Jimp(width, height, 0xffffff00);
        let offsetx = 0, offsety = 0;
        const references: GameImagesSerialized = {};
        for(const collection of this._collections) {
            const imgy = offsety * this.RESOLUTION;
            resultImage.composite(collection.image, 0, imgy, {mode: Jimp.BLEND_SOURCE_OVER, opacitySource: 1, opacityDest: 1});
            for(const [imageName, imageOffset] of Object.entries(collection.references)) {
                if(references[imageName])
                    console.warn(`Duplicate image name: ${imageName}`);
                imageOffset[1] += offsety;
                references[imageName] = imageOffset;
            }
            offsety += Math.round(collection.image.bitmap.height / this.RESOLUTION);
        }
        for(const [imageName, imageObject] of this._images.entries()) {
            if(references[imageName])
                console.warn(`Duplicate image name: ${imageName}`);
            const imgx = offsetx * this.RESOLUTION, imgy = offsety * this.RESOLUTION;
            resultImage.composite(imageObject, imgx, imgy, {mode: Jimp.BLEND_SOURCE_OVER, opacitySource: 1, opacityDest: 1});
            references[imageName] = [offsetx, offsety];
            offsetx = (offsetx + 1) % this.COLUMNS;
            if(!offsetx)
                offsety += 1;
        }
        const image: Buffer = await resultImage.getBufferAsync(Jimp.MIME_PNG);
        return {
            image,
            references,
        };
    }
}
