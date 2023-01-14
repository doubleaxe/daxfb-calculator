
import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
    diff_match_patch as DiffMatchPatch,
    DIFF_DELETE,
    DIFF_INSERT,
    DIFF_EQUAL,
} from 'diff-match-patch';

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));
const __parsed = path.join(__dirname, 'data', 'parsed');
const __static = path.join(__dirname, 'data', 'static');

//apply diff, edit, make new diff
const args = process.argv.slice(2);
let isMakeDiff = false;
let isLineDiff = false;
let isTextPatch = false;
let isPrint = false;
args.forEach((arg) => {
    if(arg == 'diff')
        isMakeDiff = true;
    if(arg == 'line')
        isLineDiff = true;
    if(arg == 'text')
        isTextPatch = true;
    if(arg == 'print')
        isPrint = true;
});

//npx ts-node build-data-diff.ts
//edit file
//npx ts-node build-data-diff.ts diff line text
//npx ts-node print
(async function() {
    const diff = new DiffMatchPatch();
    const parsedDataJson = fs.readFileSync(path.join(__parsed, 'data.json'), 'utf8');
    if(isMakeDiff) {
        const staticDataJson = fs.readFileSync(path.join(__static, 'data.json'), 'utf8');
        let diffs: ReturnType<typeof diff['diff_main']>;
        if(isLineDiff) {
            const {chars1, chars2, lineArray} = diff.diff_linesToChars_(parsedDataJson, staticDataJson);
            diffs = diff.diff_main(chars1, chars2, false);
            diff.diff_charsToLines_(diffs, lineArray);
        } else {
            diffs = diff.diff_main(parsedDataJson, staticDataJson, true);
        }
        diff.diff_cleanupSemantic(diffs);

        const patches = diff.patch_make(parsedDataJson, diffs);
        let patchesTxt: string;
        if(isTextPatch)
            patchesTxt = diff.patch_toText(patches);
        else
            patchesTxt = JSON.stringify(patches, null, '  ');
        fs.writeFileSync(path.join(__static, 'data.patch'), patchesTxt, 'utf8');
    } else {
        const patchTxt = fs.readFileSync(path.join(__static, 'data.patch'), 'utf8');
        let patches: ReturnType<typeof diff['patch_fromText']>;
        if(isTextPatch || (patchTxt[0] == '@')) {
            patches = diff.patch_fromText(patchTxt);
        } else {
            patches = JSON.parse(patchTxt);
        }
        if(isPrint) {
            const ops: string[] = [];
            ops[DIFF_DELETE] = '-';
            ops[DIFF_INSERT] = '+';
            ops[DIFF_EQUAL] = '';

            const reallyHumanReadable = patches.map(({diffs: diffs0, start1, start2, length1, length2}) => (
                [`@@ -${start1},${length1} +${start2},${length2} @@`].concat(
                    diffs0.map(([op, value]) => value.split('\n').map((v) => ops[op] + v).join('\n'))
                )
            )).flat().join('\n');
            console.log(reallyHumanReadable);
        } else {
            const [staticDataJson, results] = diff.patch_apply(patches, parsedDataJson);
            const failed = results.map((r, index) => [r, index]).filter(([r]) => !r).map(([r, index]) => index);
            if(failed.length) {
                throw new Error(`some patches failed to apply:\n${failed.join('\n')}`);
            }
            fs.writeFileSync(path.join(__static, 'data.json'), staticDataJson, 'utf8');
        }
    }
})().catch((err) => console.error(err.stack));
