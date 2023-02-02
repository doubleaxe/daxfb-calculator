/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import Jimp from 'jimp';
import type {Font} from '@jimp/plugin-print';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __parsed = path.join(__dirname, 'parsed');

let font16: Font | null = null;
let font32: Font | null = null;
async function createPlaceholderImage(image: Jimp, resolution: number, xoffset: number, yoffset: number, letters: string) {
    let font: Font | null = null;
    switch(letters.length) {
        case 1:
            if(!font32) {
                font32 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            }
            font = font32;
            yoffset += 0;
            break;
        case 2:
            if(!font16) {
                font16 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
            }
            font = font16;
            yoffset += 8;
            break;
        default:
            throw new Error(`invalid letters length: ${letters}`);
    }
    const width = Jimp.measureText(font, letters);
    xoffset += Math.round((resolution - width) / 2);
    image.print(font, xoffset, yoffset, letters);
}

(async function() {
    const args = process.argv.slice(2);
    const count = Number(args[0]) || 10;
    const resolution = Number(args[1]) || 32;

    const columns = 10;
    const rows = Math.ceil(count / columns);

    const jsonContent = {};
    const width = columns * resolution;
    const height = rows * resolution;
    const resultImage = new Jimp(width, height, 0xffffff00, (err) => {
        if(err) throw err;
    });
    let offsetx = 0, offsety = 0;

    const addImage = async(name) => {
        const imgx = offsetx * resolution, imgy = offsety * resolution;
        await createPlaceholderImage(resultImage, resolution, imgx, imgy, name);
        jsonContent[name] = [offsetx, offsety];
        offsetx = (offsetx + 1) % columns;
        if(!offsetx)
            offsety += 1;
    };

    const CHARS = [...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    for(let i = 0; i < Math.min(count, CHARS.length); i++) {
        await addImage(CHARS[i]);
    }
    resultImage.crop(0, 0, width, (offsety + 1) * resolution);
    await resultImage.writeAsync(path.join(__parsed, 'images.png'));
    await fs.writeFile(path.join(__parsed, 'images.json'), JSON.stringify(jsonContent));
})().catch((err) => console.error(err.stack));
