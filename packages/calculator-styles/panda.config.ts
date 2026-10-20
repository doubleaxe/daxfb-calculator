import { defineConfig } from '@pandacss/dev';
import { preset as PresetBase } from '@pandacss/preset-base';
import { preset as PresetPanda } from '@pandacss/preset-panda';
import { createTypographyPreset } from '@pandacss/preset-typography';

import CalculatorTheme from './src/calculator-theme.js';

export default defineConfig({
    globalCss: {
        html: {
            fontFamily: 'sans',
            fontSize: 'md',
            lineHeight: 'normal',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
            textSizeAdjust: '100%',
            backgroundColor: '{colors.page.background}',
        },
    },

    outdir: 'generated/styled-system',
    logLevel: 'warn',

    clean: true,
    presets: [
        // order matters!
        PresetBase,
        PresetPanda,
        CalculatorTheme,
        createTypographyPreset({ notProse: true, semanticTokens: { enabled: true } }),
    ],
    shorthands: false,
    prefix: 'panda',
    hash: { cssVar: false, className: process.env['NODE_ENV'] === 'production' },
    jsxFramework: '',
    outExtension: 'mjs',

    strictTokens: true,
    strictPropertyValues: true,

    conditions: {
        extend: {
            light: ':root:not(.daxfb-dark) &',
            dark: '.daxfb-dark &',
        },
    },

    patterns: {
        extend: {
            stack: {
                defaultValues: { direction: 'column', gap: 0 },
            },
            vstack: {
                defaultValues: { gap: 0 },
            },
            hstack: {
                defaultValues: { gap: 0 },
            },
        },
    },

    theme: {
        extend: {},
    },
});
