import { defineConfig } from '@pandacss/dev';

export default defineConfig({
    include: [
        './node_modules/@doubleaxe/daxfb-calculator-core/src/**/*.{ts,tsx}',
        './node_modules/@doubleaxe/daxfb-calculator-games.coi/src/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    outdir: 'generated/styled-system',
    importMap: '@doubleaxe/daxfb-calculator-styles',

    presets: [],
    shorthands: false,
    prefix: 'panda',
    hash: { cssVar: false, className: true },
    jsxFramework: 'react',
});
