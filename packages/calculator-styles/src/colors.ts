import { defineSemanticTokens } from '@pandacss/dev';

import ThemeColors from './colors-astra.js';
import { fixed } from './utils.js';

export default defineSemanticTokens({
    colors: {
        ...ThemeColors.colors,
        page: {
            background: fixed('{colors.content.background}'),
        },
    },
});
