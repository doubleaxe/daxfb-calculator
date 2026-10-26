import { defineSemanticTokens } from '@pandacss/dev';

import ThemeColors from './colors-astra.js';
import { fixed, scheme } from './utils.js';

export default defineSemanticTokens({
    colors: {
        ...ThemeColors.colors,
        page: {
            background: fixed('{colors.content.background}'),
        },
        selected: {
            border: scheme('{colors.blue.400}', '{colors.blue.600}'),
            text: scheme('{colors.blue.600}', '{colors.blue.400}'),
        },
    },
});
