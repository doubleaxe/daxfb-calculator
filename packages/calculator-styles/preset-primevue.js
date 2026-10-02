import { definePreset } from '@pandacss/dev';
import PandaPreset from '@pandacss/preset-panda';
import Aura from '@primeuix/themes/aura';

function toPandaColorRef(val) {
    if (typeof val !== 'string') return val;

    // Replace any '{name.shade}' with '{colors.name.shade}'
    return val.replace(/\{([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+)\}/g, (match, path) => {
        // Avoid double prefixing if it already has 'colors.'
        if (path.startsWith('colors.')) {
            return match;
        }
        return `{colors.${path}}`;
    });
}

function mergePrimeVueSemanticTokens(lightNode, darkNode) {
    const result = {};
    const allKeys = new Set([...Object.keys(lightNode || {}), ...Object.keys(darkNode || {})]);

    for (const key of allKeys) {
        const lightVal = lightNode ? lightNode[key] : undefined;
        const darkVal = darkNode ? darkNode[key] : undefined;

        const isLightObj = typeof lightVal === 'object' && lightVal !== null;
        const isDarkObj = typeof darkVal === 'object' && darkVal !== null;

        if (isLightObj || isDarkObj) {
            // Recurse down nested objects (e.g. surface, primary, highlight)
            result[key] = mergePrimeVueSemanticTokens(lightVal || {}, darkVal || {});
        } else {
            // Terminal value: output Panda semantic token shape
            result[key] = {
                value: {
                    base: toPandaColorRef(lightVal),
                    _dark: toPandaColorRef(darkVal),
                },
            };
        }
    }

    return result;
}

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

const PandaPrimaryColorPalette = Object.fromEntries(
    Object.entries(Aura.semantic.primary).map(([i, c]) => [i, toPandaColorRef(c)])
);

const PrimeVueSemanticTokens = Aura.semantic.colorScheme;
const PandaSemanticTokens = mergePrimeVueSemanticTokens(PrimeVueSemanticTokens.light, PrimeVueSemanticTokens.dark);
// console.log(JSON.stringify(PandaPrimaryColorPalette, null, 2));
// console.log(JSON.stringify(PandaSemanticTokens, null, 2));

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
        semanticTokens: {
            colors: {
                primary: PandaPrimaryColorPalette,
                ...PandaSemanticTokens,
            },
        },
    },
});
