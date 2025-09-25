import reactTs from '@doubleaxe/eslint-config/react-ts';
import { defineConfig } from 'eslint/config';

const extendFiles = reactTs.utils.extendFiles;
const patterns = reactTs.patterns;
const configs = reactTs.configs;

export default defineConfig([
    {
        ignores: ['**/gamedata-generated/src/*/'],
    },
    extendFiles(configs.esNextRoot, [...patterns.esFilter, ...patterns.tsFilter]),
    {
        name: 'ts',
        files: patterns.tsFilter,
        extends: [configs.tsRoot],
        rules: {
            '@typescript-eslint/no-shadow': [
                'error',
                {
                    builtinGlobals: true,
                    allow: ['Text'],
                },
            ],
        },
    },
    extendFiles(configs.reactTsRoot, patterns.tsxFilter),
    {
        name: 'web',
        files: ['packages/calculator-ui/**'],
        ignores: [...patterns.toolsEs, ...patterns.toolsTs, '**/panda.config.ts', '**/postcss.config.js'],
        extends: [configs.browser],
    },
    {
        name: 'node',
        files: ['packages/gamedata/**', ...patterns.toolsEs, ...patterns.toolsTs],
        extends: [reactTs.configs.node],
    },
]);
