
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));
const __parsed = path.join(__dirname, 'data', 'parsed');
const __static = path.join(__dirname, 'data', 'static');
const __target = path.join(__dirname, 'site', 'data');

const args = process.argv.slice(2);
const isMinimize = args[0] != 'dev';

(async function() {
    fs.mkdirSync(__target, {recursive: true});

    const parsedDataJson = JSON.parse(fs.readFileSync(path.join(__parsed, 'data.json')), 'utf8');
    const staticDataJson = JSON.parse(fs.readFileSync(path.join(__static, 'data.json')), 'utf8');
    const mergedDataJson = mergeData(parsedDataJson, staticDataJson);

    const imagesJson = JSON.parse(fs.readFileSync(path.join(__parsed, 'images.json')), 'utf8');
    mergedDataJson.images = imagesJson;
    optimizeData(mergedDataJson);
    fs.writeFileSync(path.join(__target, 'data.json'), JSON.stringify(mergedDataJson, undefined, isMinimize ? undefined : '  '));

    const images = fs.readFileSync(path.join(__parsed, 'images.png'));
    fs.writeFileSync(path.join(__target, 'images.png'), images);
})().catch((err) => console.error(err.stack));

function mergeData(parsedDataJson, staticDataJson) {
    for(const [id, recipe] of Object.entries(staticDataJson.recipes)) {
        parsedDataJson.recipes[id] = recipe;
    }
    return parsedDataJson;
}

function optimizeData(dataJson) {

}
