
import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createPatch, applyPatch} from 'diff';

//apply diff, edit, make new diff
const args = process.argv.slice(2);
const game = process.env['GAME'] || 'example';
let isMakeDiff = false;
args.forEach((arg) => {
    if(arg == 'diff')
        isMakeDiff = true;
});

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));
const __parsed = path.join(__dirname, 'data', game, 'parsed');
const __static = path.join(__dirname, 'data', game, 'static');

//GAME=evospace npx ts-node build-data-diff.ts
//edit file
//GAME=evospace npx ts-node build-data-diff.ts diff
(async function() {
    const parsedDataJson = fs.readFileSync(path.join(__parsed, 'data.json'), 'utf8');
    if(isMakeDiff) {
        const staticDataJson = fs.readFileSync(path.join(__static, 'data.json'), 'utf8');
        const patchesTxt = createPatch('data.json', parsedDataJson, staticDataJson, undefined, undefined, {
            context: 7,
        });
        fs.writeFileSync(path.join(__static, 'data.patch'), patchesTxt, 'utf8');
    } else {
        const patchTxt = fs.readFileSync(path.join(__static, 'data.patch'), 'utf8');
        const staticDataJson = applyPatch(parsedDataJson, patchTxt);
        fs.writeFileSync(path.join(__static, 'data.json'), staticDataJson, 'utf8');
    }
})().catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
