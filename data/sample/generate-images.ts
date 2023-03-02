/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {ImageProcessor} from '../image-processor';


export async function generateImages(count = 36, resolution = 32) {
    const imageProcessor = new ImageProcessor(resolution);
    const CHARS = [...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    for(let i = 0; i < Math.min(count, CHARS.length); i++) {
        const name = CHARS[i] || '';
        await imageProcessor.addPlaceholderImage(name, name);
    }

    const {image, references} = await imageProcessor.composeImage();
    return {
        image,
        imageJson: references,
    };
}
