/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';
import {rollup, type InputOptions, type OutputOptions} from 'rollup';
import virtual from '@rollup/plugin-virtual';
import typescript from '@rollup/plugin-typescript';
import {minify} from 'rollup-plugin-esbuild';

import {KeyProcessor} from './data/key-processor';
import type {ConverterFactory} from './data/processing';

//npx ts-node build-data.ts [clean] [debug]
//node --loader ts-node/esm --inspect-brk build-data.ts [clean] [debug]
const args = process.argv.slice(2);
let isRebuildKeys = false;
let isDebug = false;
args.forEach((arg) => {
    if(arg == 'clean')
        isRebuildKeys = true;
    if(arg == 'debug')
        isDebug = true;
});

const _dirname = __dirname;
const _games = path.join(_dirname, 'data');
const _target = path.join(_dirname, 'site', 'public', 'games');


(async function() {
    fs.rmSync(_target, {recursive: true, force: true});
    fs.mkdirSync(_target, {recursive: true});

    const gameList = JSON.parse(fs.readFileSync(path.join(_games, 'game-list.json'), 'utf8')) as string[];
    for(const game of gameList) {
        await buildSingleGame(game);
    }
})().catch((err) => {
    console.error(err.stack);
    process.exit(1);
});

async function buildSingleGame(game: string) {
    const gameDir = path.join(_games, game);
    const targetGameDir = path.join(_target, game);
    fs.mkdirSync(targetGameDir, {recursive: true});

    const converterPackage = await import(path.join(gameDir, 'converter.ts'));
    const useConverter: ConverterFactory = converterPackage.useConverter;
    const {
        convertGameData,
        loadImages,
    } = useConverter();
    const gameData = await convertGameData();
    const {
        gameData: minifiedGameData,
        reverceKeys,
    } = await (new KeyProcessor(gameData, gameDir, isRebuildKeys).processKeys());
    const gameDataString = JSON.stringify(minifiedGameData);

    const imagesData = await loadImages();
    if(imagesData) {
        fs.writeFileSync(path.join(targetGameDir, 'images.png'), imagesData);
    }

    await packageGameData(gameDir, targetGameDir, gameDataString, reverceKeys);
}

async function packageGameData(gameDir: string, targetGameDir: string, gameDataString: string, reverceKeys: {[k: string]: string}) {
    const calculatorPath = path.join(gameDir, 'calculator', 'calculator.ts');
    const calculatorTargetPath = path.join(targetGameDir, 'game.js');
    const inputOptions: InputOptions = {
        input: 'entry',
        plugins: [
            virtual({
                entry: `
export * from '${calculatorPath}';
export const gameData = ${gameDataString};
${isDebug ? ('export const debugKeys = ' + JSON.stringify(reverceKeys) + ';') : ''}
`,
            }),
            typescript({
                tsconfig: './tsconfig.rollup.json',
                compilerOptions: {},
            }),
            ...(isDebug ? [] : [minify()]),
        ],
    };
    const outputOptions: OutputOptions = {
        file: calculatorTargetPath,
        format: 'iife',
        name: 'gameImplementation',
        sourcemap: true,
    };

    const bundle = await rollup(inputOptions);
    try {
        await bundle.write(outputOptions);
    } finally {
        bundle.close();
    }
}
