import { baseConfig } from '@doubleaxe/daxfb-calculator-styles/panda.config';
import { defineConfig } from '@pandacss/dev';

// only css generation options, because we have external '@doubleaxe/daxfb-calculator-styles'
export default defineConfig({
    ...baseConfig,
    include: [
        './node_modules/@doubleaxe/daxfb-calculator-core/src/**/*.{ts,tsx}',
        './node_modules/@doubleaxe/daxfb-calculator-games.coi/src/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    outdir: 'generated/styled-system',
    importMap: '@doubleaxe/daxfb-calculator-styles',

    watch: true,
    emitTokensOnly: true,
});
