import { token } from '@daxfb/styles/tokens';
import AuraPreset from '@primeuix/themes/aura';
import type { Preset } from '@primeuix/themes/types';

// panda is the primary source of truth, we build the primevue theme based on it
// override everything, do not merge (definePreset is deepMerge)
// remove now unused base color palette
const Aura = (AuraPreset.default ?? AuraPreset) as Preset;

const colorScale = (color: string) => ({
    50: token.var(`colors.${color}.50`),
    100: token.var(`colors.${color}.100`),
    200: token.var(`colors.${color}.200`),
    300: token.var(`colors.${color}.300`),
    400: token.var(`colors.${color}.400`),
    500: token.var(`colors.${color}.500`),
    600: token.var(`colors.${color}.600`),
    700: token.var(`colors.${color}.700`),
    800: token.var(`colors.${color}.800`),
    900: token.var(`colors.${color}.900`),
    950: token.var(`colors.${color}.950`),
});

const semantic = {
    transitionDuration: token.var('durations.normal'),
    focusRing: {
        width: '1px',
        style: 'solid',
        color: '{primary.color}',
        offset: '2px',
        shadow: 'none',
    },
    disabledOpacity: '0.6',
    iconSize: token.var('sizes.4'),
    anchorGutter: '2px',
    primary: colorScale('emerald'),
    formField: {
        paddingX: token.var('spacing.3'),
        paddingY: token.var('spacing.2'),
        sm: {
            fontSize: token.var('fontSizes.sm'),
            paddingX: token.var('spacing.2.5'),
            paddingY: token.var('spacing.1.5'),
        },
        lg: {
            fontSize: token.var('fontSizes.lg'),
            paddingX: token.var('spacing.3.5'),
            paddingY: token.var('spacing.2.5'),
        },
        borderRadius: token.var('radii.md'),
        focusRing: {
            width: '0',
            style: 'none',
            color: 'transparent',
            offset: '0',
            shadow: 'none',
        },
        transitionDuration: '{transition.duration}',
    },
    list: {
        padding: `${token.var('spacing.1')} ${token.var('spacing.1')}`,
        gap: '2px',
        header: {
            padding: `${token.var('spacing.2')} ${token.var('spacing.4')} ${token.var('spacing.1')} ${token.var('spacing.4')}`,
        },
        option: {
            padding: `${token.var('spacing.2')} ${token.var('spacing.3')}`,
            borderRadius: token.var('radii.sm'),
        },
        optionGroup: {
            padding: `${token.var('spacing.2')} ${token.var('spacing.3')}`,
            fontWeight: token.var('fontWeights.semibold'),
        },
    },
    content: {
        borderRadius: token.var('radii.md'),
    },
    mask: {
        transitionDuration: token.var('durations.slow'),
    },
    navigation: {
        list: {
            padding: `${token.var('spacing.1')} ${token.var('spacing.1')}`,
            gap: '2px',
        },
        item: {
            padding: `${token.var('spacing.2')} ${token.var('spacing.3')}`,
            borderRadius: token.var('radii.sm'),
            gap: token.var('spacing.2'),
        },
        submenuLabel: {
            padding: `${token.var('spacing.2')} ${token.var('spacing.3')}`,
            fontWeight: token.var('fontWeights.semibold'),
        },
        submenuIcon: {
            size: token.var('fontSizes.sm'),
        },
    },
    overlay: {
        select: {
            borderRadius: token.var('radii.md'),
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        },
        popover: {
            borderRadius: token.var('radii.md'),
            padding: token.var('spacing.3'),
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        },
        modal: {
            borderRadius: token.var('radii.xl'),
            padding: token.var('spacing.5'),
            shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        navigation: {
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        },
    },
    colorScheme: {
        light: {
            surface: {
                0: token.var('colors.white'),
                50: token.var('colors.slate.50'),
                100: token.var('colors.slate.100'),
                200: token.var('colors.slate.200'),
                300: token.var('colors.slate.300'),
                400: token.var('colors.slate.400'),
                500: token.var('colors.slate.500'),
                600: token.var('colors.slate.600'),
                700: token.var('colors.slate.700'),
                800: token.var('colors.slate.800'),
                900: token.var('colors.slate.900'),
                950: token.var('colors.slate.950'),
            },
            primary: {
                color: '{primary.500}',
                contrastColor: token.var('colors.white'),
                hoverColor: '{primary.600}',
                activeColor: '{primary.700}',
            },
            highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.100}',
                color: '{primary.700}',
                focusColor: '{primary.800}',
            },
            mask: {
                background: 'rgba(0,0,0,0.4)',
                color: '{surface.200}',
            },
            formField: {
                background: '{surface.0}',
                disabledBackground: '{surface.200}',
                filledBackground: '{surface.50}',
                filledHoverBackground: '{surface.50}',
                filledFocusBackground: '{surface.50}',
                borderColor: '{surface.300}',
                hoverBorderColor: '{surface.400}',
                focusBorderColor: '{primary.color}',
                invalidBorderColor: token.var('colors.red.400'),
                color: '{surface.700}',
                disabledColor: '{surface.500}',
                placeholderColor: '{surface.500}',
                invalidPlaceholderColor: token.var('colors.red.600'),
                floatLabelColor: '{surface.500}',
                floatLabelFocusColor: '{primary.600}',
                floatLabelActiveColor: '{surface.500}',
                floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
                iconColor: '{surface.400}',
                shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
            },
            text: {
                color: '{surface.700}',
                hoverColor: '{surface.800}',
                mutedColor: '{surface.500}',
                hoverMutedColor: '{surface.600}',
            },
            content: {
                background: '{surface.0}',
                hoverBackground: '{surface.100}',
                borderColor: '{surface.200}',
                color: '{text.color}',
                hoverColor: '{text.hover.color}',
            },
            overlay: {
                select: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{text.color}',
                },
                popover: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{text.color}',
                },
                modal: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{text.color}',
                },
            },
            list: {
                option: {
                    focusBackground: '{surface.100}',
                    selectedBackground: '{highlight.background}',
                    selectedFocusBackground: '{highlight.focus.background}',
                    color: '{text.color}',
                    focusColor: '{text.hover.color}',
                    selectedColor: '{highlight.color}',
                    selectedFocusColor: '{highlight.focus.color}',
                    icon: {
                        color: '{surface.400}',
                        focusColor: '{surface.500}',
                    },
                },
                optionGroup: {
                    background: 'transparent',
                    color: '{text.muted.color}',
                },
            },
            navigation: {
                item: {
                    focusBackground: '{surface.100}',
                    activeBackground: '{surface.100}',
                    color: '{text.color}',
                    focusColor: '{text.hover.color}',
                    activeColor: '{text.hover.color}',
                    icon: {
                        color: '{surface.400}',
                        focusColor: '{surface.500}',
                        activeColor: '{surface.500}',
                    },
                },
                submenuLabel: {
                    background: 'transparent',
                    color: '{text.muted.color}',
                },
                submenuIcon: {
                    color: '{surface.400}',
                    focusColor: '{surface.500}',
                    activeColor: '{surface.500}',
                },
            },
        },
        dark: {
            surface: {
                0: token.var('colors.white'),
                50: token.var('colors.zinc.50'),
                100: token.var('colors.zinc.100'),
                200: token.var('colors.zinc.200'),
                300: token.var('colors.zinc.300'),
                400: token.var('colors.zinc.400'),
                500: token.var('colors.zinc.500'),
                600: token.var('colors.zinc.600'),
                700: token.var('colors.zinc.700'),
                800: token.var('colors.zinc.800'),
                900: token.var('colors.zinc.900'),
                950: token.var('colors.zinc.950'),
            },
            primary: {
                color: '{primary.400}',
                contrastColor: '{surface.900}',
                hoverColor: '{primary.300}',
                activeColor: '{primary.200}',
            },
            highlight: {
                background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)',
            },
            mask: {
                background: 'rgba(0,0,0,0.6)',
                color: '{surface.200}',
            },
            formField: {
                background: '{surface.950}',
                disabledBackground: '{surface.700}',
                filledBackground: '{surface.800}',
                filledHoverBackground: '{surface.800}',
                filledFocusBackground: '{surface.800}',
                borderColor: '{surface.600}',
                hoverBorderColor: '{surface.500}',
                focusBorderColor: '{primary.color}',
                invalidBorderColor: token.var('colors.red.300'),
                color: '{surface.0}',
                disabledColor: '{surface.400}',
                placeholderColor: '{surface.400}',
                invalidPlaceholderColor: token.var('colors.red.400'),
                floatLabelColor: '{surface.400}',
                floatLabelFocusColor: '{primary.color}',
                floatLabelActiveColor: '{surface.400}',
                floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
                iconColor: '{surface.400}',
                shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
            },
            text: {
                color: '{surface.0}',
                hoverColor: '{surface.0}',
                mutedColor: '{surface.400}',
                hoverMutedColor: '{surface.300}',
            },
            content: {
                background: '{surface.900}',
                hoverBackground: '{surface.800}',
                borderColor: '{surface.700}',
                color: '{text.color}',
                hoverColor: '{text.hover.color}',
            },
            overlay: {
                select: {
                    background: '{surface.900}',
                    borderColor: '{surface.700}',
                    color: '{text.color}',
                },
                popover: {
                    background: '{surface.900}',
                    borderColor: '{surface.700}',
                    color: '{text.color}',
                },
                modal: {
                    background: '{surface.900}',
                    borderColor: '{surface.700}',
                    color: '{text.color}',
                },
            },
            list: {
                option: {
                    focusBackground: '{surface.800}',
                    selectedBackground: '{highlight.background}',
                    selectedFocusBackground: '{highlight.focus.background}',
                    color: '{text.color}',
                    focusColor: '{text.hover.color}',
                    selectedColor: '{highlight.color}',
                    selectedFocusColor: '{highlight.focus.color}',
                    icon: {
                        color: '{surface.500}',
                        focusColor: '{surface.400}',
                    },
                },
                optionGroup: {
                    background: 'transparent',
                    color: '{text.muted.color}',
                },
            },
            navigation: {
                item: {
                    focusBackground: '{surface.800}',
                    activeBackground: '{surface.800}',
                    color: '{text.color}',
                    focusColor: '{text.hover.color}',
                    activeColor: '{text.hover.color}',
                    icon: {
                        color: '{surface.500}',
                        focusColor: '{surface.400}',
                        activeColor: '{surface.400}',
                    },
                },
                submenuLabel: {
                    background: 'transparent',
                    color: '{text.muted.color}',
                },
                submenuIcon: {
                    color: '{surface.500}',
                    focusColor: '{surface.400}',
                    activeColor: '{surface.400}',
                },
            },
        },
    },
};

const Panda: Preset<{ semantic: typeof semantic }> = {
    components: Aura.components,
    semantic,
};

export default Panda;
