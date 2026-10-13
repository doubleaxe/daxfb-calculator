import { defineSemanticTokens } from '@pandacss/dev';

import ThemeColors from './colors-astra.js';

export default defineSemanticTokens({
    colors: {
        ...ThemeColors.colors,
        border: {
            value: {
                _light: '{colors.slate.200}',
                _dark: '{colors.zinc.700}',
            },
        },
    },
});
