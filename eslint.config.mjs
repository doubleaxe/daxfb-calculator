import reactTs from '@doubleaxe/eslint-config/react-ts';
import modulePathFixer from '@doubleaxe/eslint-plugin-module-path-fixer';
import { defineConfig } from 'eslint/config';

const patterns = reactTs.patterns;
const configs = reactTs.configs;

const nodeFiles = [...patterns.toolsEs, ...patterns.toolsTs, '**/panda.config.ts', '**/postcss.config.js'];

export default defineConfig([
    {
        ignores: [
            '**/gamedata-generated/src/*/',
            '**/generated/styled-system',
            'packages/calculator-styles/panda.config.d.ts',
        ],
    },
    {
        name: 'es',
        files: [...patterns.esFilter, ...patterns.tsFilter],
        extends: [configs.esNextRoot],
        plugins: {
            'module-path-fixer': modulePathFixer,
        },
        rules: {
            'module-path-fixer/prefer-alias-or-relative': ['error'],
            'module-path-fixer/extensions': ['error', { extension: 'always', index: 'always' }],
        },
    },
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
    {
        name: 'tsx',
        files: patterns.tsxFilter,
        extends: [configs.reactTsRoot],
        rules: {
            'perfectionist/sort-jsx-props': 'off',
        },
    },
    {
        name: 'web',
        files: ['packages/calculator-ui/**'],
        ignores: [...nodeFiles],
        extends: [configs.browser],
    },
    {
        name: 'node',
        files: ['packages/gamedata/**', ...nodeFiles],
        extends: [configs.node],
    },
]);
