import { defineConfig, definePattern } from '@pandacss/dev';

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

export const baseConfig = defineConfig({
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
});

export default defineConfig({
    ...baseConfig,
    patterns: {
        extend: patterns,
    },
});
