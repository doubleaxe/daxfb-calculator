import { defineAnimationStyles, defineConfig, definePattern } from '@pandacss/dev';

// only code generation options, because we have separate css generator
const patterns = {
    // remove gap
    // https://github.com/chakra-ui/panda/discussions/810
    stack: definePattern({
        defaultValues: { direction: 'column', gap: undefined },
    }),
    vstack: definePattern({
        defaultValues: { gap: undefined },
    }),
    hstack: definePattern({
        defaultValues: { gap: undefined },
    }),
};

export default defineConfig({
    outdir: 'generated/styled-system',

    clean: true,
    presets: [],
    shorthands: false,
    prefix: 'panda',
    hash: { cssVar: false, className: true },
    jsxFramework: 'react',

    conditions: {
        extend: {
            light: '[data-mantine-color-scheme="light"] &',
            dark: '[data-mantine-color-scheme="dark"] &',
        },
    },

    patterns: {
        extend: patterns,
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
