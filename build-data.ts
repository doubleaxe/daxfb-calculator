/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';
import {deflateSync} from 'node:zlib';
import {rollup, type InputOptions, type OutputOptions} from 'rollup';
import virtual from '@rollup/plugin-virtual';
import typescript from '@rollup/plugin-typescript';
import {minify} from 'rollup-plugin-esbuild';

import {KeyProcessor} from './data/key-processor';
import type {ConverterFactory} from './data/processing';
import type {DebugKeys, GameDataSerialized} from '#types/game-data-serialized';

//npx ts-node build-data.ts [rebuild_keys] [debug]
//node --loader ts-node/esm --inspect-brk build-data.ts [rebuild_keys] [debug]
const args = process.argv.slice(2);
let isRebuildKeys = false;
let isDebug = false;
args.forEach((arg) => {
    if(arg == 'rebuild_keys')
        isRebuildKeys = true;
    if(arg == 'debug')
        isDebug = true;
});

const _dirname = __dirname;
const _games = path.join(_dirname, 'data');
const _types = path.join(_dirname, 'site', 'data', 'types');
const _target = path.join(_dirname, 'site', 'public', 'games');


(async function() {
    fs.rmSync(_target, {recursive: true, force: true});
    fs.mkdirSync(_target, {recursive: true});

    const gameList = JSON.parse(fs.readFileSync(path.join(_types, 'game-list.json'), 'utf8')) as {[k: string]: string};
    for(const game of Object.keys(gameList)) {
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

    const {default: converterFactory}: {default: ConverterFactory} = await import(path.join(gameDir, 'converter.ts'));
    const {
        gameData,
        imagesData,
    } = await converterFactory.useConverter();
    const {
        gameData: minifiedGameData,
        reverceKeys,
    } = await (new KeyProcessor(gameData, gameDir, isRebuildKeys, isDebug).processKeys());

    if(imagesData) {
        fs.writeFileSync(path.join(targetGameDir, 'images.png'), imagesData);
    }

    await packageGameData(gameDir, targetGameDir, minifiedGameData, reverceKeys);
}

async function packageGameData(gameDir: string, targetGameDir: string, gameData: GameDataSerialized, reverceKeys: DebugKeys) {
    //will be minified but sourcemapped in release mode
    let gameDataString: string;
    if(isDebug) {
        gameDataString = JSON.stringify(gameData, undefined, '  ');
    } else {
        gameDataString = JSON.stringify(gameData);
        gameDataString = "'" + deflateSync(Buffer.from(gameDataString, 'utf8'), {level: 9}).toString('base64') + "'";
    }
    const reverceKeysString = 'undefined';
    const calculatorPath = path.join(gameDir, 'calculator', 'calculator.ts');
    const calculatorTargetPath = path.join(targetGameDir, 'game.js');
    const inputOptions: InputOptions = {
        input: 'entry',
        plugins: [
            //virtual doesn't build typescript files
            //this is written in javascript, and it should be checked whenever GameImplementation interface changes
            virtual({
                entry: `
import {useCalculator} from '${calculatorPath}';
const gameData = ${gameDataString};
const debugKeys = ${isDebug ? reverceKeysString : 'undefined'};
const gameImplementation = {
    useCalculator,
    useGameData: function() { return gameData; },
};
export default gameImplementation;
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
