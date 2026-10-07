import { definePreset } from '@pandacss/dev';
import { preset as PandaPreset } from '@pandacss/preset-panda';
import type { SemanticTokens } from '@pandacss/types';
import AuraPreset from '@primeuix/themes/aura';

function toKebabCase(str: string) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function mergeToPandaTokens(node: Record<string, unknown> | undefined, currentPath: string[] = []) {
    if (!node) return {};
    const result: Exclude<SemanticTokens['colors'], undefined> = {};

    for (const key of Object.keys(node || {})) {
        const val = node[key];
        const nextPath = [...currentPath, key];

        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            result[key] = mergeToPandaTokens(val as Record<string, unknown>, nextPath);
        } else {
            const varName = nextPath.map(toKebabCase).join('-');
            result[key] = {
                value: `var(--p-${varName})`,
            };
        }
    }

    return result;
}

const Aura = AuraPreset.default ?? AuraPreset;
const BaseTheme = PandaPreset.theme;

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
            Object.entries((Aura.primitive as Record<string, unknown>)?.[color] ?? {}).map(([i]) => [
                i,
                { value: `var(--p-${color}-${i})` },
            ])
        ),
    ])
);

const PandaPrimaryColorPalette = mergeToPandaTokens({ primary: Aura.semantic?.primary });
const PandaSemanticTokens = mergeToPandaTokens(Aura.semantic?.colorScheme?.light);
Object.assign(PandaSemanticTokens['primary']!, PandaPrimaryColorPalette['primary']);

// console.log(JSON.stringify(PandaPrimaryColorPalette, null, 2));
// console.log(JSON.stringify(PandaSemanticTokens, null, 2));

export default definePreset({
    name: 'primevue',
    theme: {
        breakpoints: BaseTheme.breakpoints,
        textStyles: BaseTheme.textStyles,
        containers: BaseTheme.containers,
        tokens: {
            ...BaseTheme.tokens,
            colors: {
                ...PandaColorPalette,
            },
        },
        semanticTokens: {
            colors: {
                ...PandaSemanticTokens,
            },
        },
    },
});
