import { defineAnimationStyles, defineConfig } from '@pandacss/dev';
import { preset as PresetBase } from '@pandacss/preset-base';

import GlobalTheme from './global-theme.js';
import PresetPrimevue from './preset-primevue.js';

export default defineConfig({
    ...GlobalTheme,

    outdir: 'generated/styled-system',
    logLevel: 'warn',

    clean: true,
    presets: [PresetBase, PresetPrimevue],
    shorthands: false,
    prefix: 'panda',
    hash: { cssVar: false, className: process.env['NODE_ENV'] === 'production' },
    jsxFramework: '',
    outExtension: 'mjs',

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
        extend: {
            semanticTokens: {
                shadows: {
                    scaleBurstShadow: {
                        value: {
                            _light: 'drop-shadow(0px 0px 25px rgba(255, 255, 255, 1)) drop-shadow(0px 0px 10px rgba(255, 255, 255, 1))',
                            _dark: 'drop-shadow(0px 0px 25px rgba(0, 0, 0, 1)) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.9))',
                        },
                    },
                },
            },
            keyframes: {
                scaleBurst: {
                    '0%': {
                        transform: 'scale(0.5)',
                        filter: 'token(shadows.scaleBurstShadow)',
                    },
                    '50%': {
                        transform: 'scale(1.15)',
                    },
                    '100%': {
                        transform: 'scale(1)',
                    },
                },
            },
            animationStyles: defineAnimationStyles({
                scaleBurst: {
                    value: {
                        animationName: 'scaleBurst',
                        animationDuration: '0.6s',
                        animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                        animationFillMode: 'forwards',
                    },
                },
            }),
        },
    },
});
