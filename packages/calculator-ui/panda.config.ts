import { defineConfig, definePattern } from '@pandacss/dev';

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
    include: ['./src/**/*.{ts,tsx}'],
    exclude: ['src/generated/**'],
    outdir: 'generated/styled-system',

    presets: [],
    shorthands: false,
    prefix: 'panda',
    hash: { cssVar: false, className: true },
    jsxFramework: 'react',
    patterns: {
        extend: patterns,
    },
});
