import baseConfig from '@doubleaxe/daxfb-calculator-styles/panda.config';
import { defineConfig } from '@pandacss/dev';

// only css generation options, because we have external '@doubleaxe/daxfb-calculator-styles'
// panda is somewhat broken with this setup (external styles module, ./node_modules/... imports) and watch mode
// while classes are regenerated, styles css is not updated if submodule was changed, it only reacts to main project changes
// to fix this we use panda cli here, because it is much more reliable than panda postcss plugin
export default defineConfig({
    ...baseConfig,
    include: [
        './node_modules/@doubleaxe/daxfb-calculator-core/src/**/*.{ts,tsx,vue}',
        './node_modules/@doubleaxe/daxfb-calculator-games.coi/src/**/*.{ts,tsx,vue}',
        './src/**/*.{ts,tsx,vue}',
    ],
    importMap: '@doubleaxe/daxfb-calculator-styles',
});
