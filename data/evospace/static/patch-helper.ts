/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';
import {createPatch, applyPatch} from 'diff';

//apply diff, edit, make new diff
const args = process.argv.slice(2);
let isMakeDiff = false;
args.forEach((arg) => {
    if(arg == 'diff')
        isMakeDiff = true;
});

const _dirname = __dirname;
const _parsed = path.join(_dirname, '../parsed');
const _static = _dirname;

//npx ts-node patch-helper.ts
//edit file
//npx ts-node patch-helper.ts diff
(async function() {
    const parsedDataJson = fs.readFileSync(path.join(_parsed, 'data.json'), 'utf8');
    if(isMakeDiff) {
        const staticDataJson = fs.readFileSync(path.join(_static, 'data.json'), 'utf8');
        const patchesTxt = createPatch('data.json', parsedDataJson, staticDataJson, undefined, undefined, {
            context: 7,
        });
        fs.writeFileSync(path.join(_static, 'data.patch'), patchesTxt, 'utf8');
    } else {
        const patchTxt = fs.readFileSync(path.join(_static, 'data.patch'), 'utf8');
        const staticDataJson = applyPatch(parsedDataJson, patchTxt);
        fs.writeFileSync(path.join(_static, 'data.json'), staticDataJson, 'utf8');
    }
})().catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
