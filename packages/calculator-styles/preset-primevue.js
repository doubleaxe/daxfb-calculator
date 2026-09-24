import { definePreset } from '@pandacss/dev';
import PandaPreset from '@pandacss/preset-panda';
import Aura from '@primeuix/themes/aura';

const BaseTheme = PandaPreset.theme;
const BaseTokens = BaseTheme.tokens;

const PrimeVueColorNames = [
    'emerald',
    'green',
    'lime',
    'red',
    'orange',
    'amber',
    'yellow',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
];

const PandaColorPalette = Object.fromEntries(
    PrimeVueColorNames.map((color) => [
        color,
        Object.fromEntries(
            Object.entries(Aura.primitive[color]).map(([i]) => [i, { value: `var(--p-${color}-${i})` }])
        ),
    ])
);

export default definePreset({
    name: 'primevue',
    theme: {
        breakpoints: BaseTheme.breakpoints,
        textStyles: BaseTheme.textStyles,
        containerSizes: BaseTheme.containerSizes,
        tokens: {
            ...BaseTokens,
            colors: {
                ...PandaColorPalette,
            },
        },
    },
});
