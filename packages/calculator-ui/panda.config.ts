import { defineConfig } from '@pandacss/dev';

// only css generation options, because we have external '@daxfb/styles'
// panda is somewhat broken with this setup (external styles module, ./node_modules/... imports) and watch mode
// while classes are regenerated, styles css is not updated if submodule was changed, it only reacts to main project changes
// to fix this we use panda cli here, because it is much more reliable than panda postcss plugin
export default defineConfig({
    outdir: 'generated/styled-system',
    logLevel: 'warn',

    designSystem: '@daxfb/styles',
    include: [
        './node_modules/@daxfb/core/src/**/*.{ts,vue}',
        './node_modules/@daxfb/games.coi/src/**/*.{ts,vue}',
        './src/**/*.{ts,vue}',
    ],
});
