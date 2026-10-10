import { token } from '@daxfb/styles/tokens';
import MaterialPreset from '@primeuix/themes/material';
import type { Preset } from '@primeuix/themes/types';

// panda is the primary source of truth, we build the primevue theme based on it
// override everything, do not merge (definePreset is deepMerge)
// remove now unused base color palette
const Material = (MaterialPreset.default ?? MaterialPreset) as Preset;

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
        width: '0',
        style: 'none',
        color: 'unset',
        offset: '0',
    },
    disabledOpacity: '0.38',
    iconSize: token.var('sizes.4'),
    anchorGutter: '0',
    primary: colorScale('emerald'),
    formField: {
        paddingX: token.var('spacing.3'),
        paddingY: token.var('spacing.3'),
        sm: {
            fontSize: token.var('fontSizes.sm'),
            paddingX: token.var('spacing.2.5'),
            paddingY: token.var('spacing.2.5'),
        },
        lg: {
            fontSize: token.var('fontSizes.lg'),
            paddingX: token.var('spacing.3.5'),
            paddingY: token.var('spacing.3.5'),
        },
        borderRadius: token.var('radii.sm'),
        focusRing: {
            width: '2px',
            style: 'solid',
            color: '{primary.color}',
            offset: '-2px',
            shadow: 'none',
        },
        transitionDuration: '{transition.duration}',
    },
    list: {
        padding: `${token.var('spacing.2')} 0`,
        gap: '0',
        header: {
            padding: `${token.var('spacing.3')} ${token.var('spacing.4')}`,
        },
        option: {
            padding: `${token.var('spacing.3')} ${token.var('spacing.4')}`,
            borderRadius: '0',
        },
        optionGroup: {
            padding: `${token.var('spacing.3')} ${token.var('spacing.4')}`,
            fontWeight: token.var('fontWeights.bold'),
        },
    },
    content: {
        borderRadius: token.var('radii.sm'),
    },
    mask: {
        transitionDuration: token.var('durations.slow'),
    },
    navigation: {
        list: {
            padding: `${token.var('spacing.2')} 0`,
            gap: '0',
        },
        item: {
            padding: `${token.var('spacing.3')} ${token.var('spacing.4')}`,
            borderRadius: '0',
            gap: token.var('spacing.2'),
        },
        submenuLabel: {
            padding: `${token.var('spacing.3')} ${token.var('spacing.4')}`,
            fontWeight: token.var('fontWeights.bold'),
        },
        submenuIcon: {
            size: token.var('fontSizes.sm'),
        },
    },
    overlay: {
        select: {
            borderRadius: token.var('radii.sm'),
            shadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)',
        },
        popover: {
            borderRadius: token.var('radii.sm'),
            padding: token.var('spacing.4'),
            shadow: '0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12)',
        },
        modal: {
            borderRadius: token.var('radii.sm'),
            padding: token.var('spacing.6'),
            shadow: '0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12)',
        },
        navigation: {
            shadow: '0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12)',
        },
    },
    colorScheme: {
        light: {
            focusRing: {
                shadow: '0 0 1px 4px {surface.200}',
            },
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
                hoverColor: '{primary.400}',
                activeColor: '{primary.300}',
            },
            highlight: {
                background: 'color-mix(in srgb, {primary.color}, transparent 88%)',
                focusBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
                color: '{primary.700}',
                focusColor: '{primary.800}',
            },
            mask: {
                background: 'rgba(0,0,0,0.32)',
                color: '{surface.200}',
            },
            formField: {
                background: '{surface.0}',
                disabledBackground: '{surface.300}',
                filledBackground: '{surface.100}',
                filledHoverBackground: '{surface.200}',
                filledFocusBackground: '{surface.100}',
                borderColor: '{surface.400}',
                hoverBorderColor: '{surface.900}',
                focusBorderColor: '{primary.color}',
                invalidBorderColor: token.var('colors.red.800'),
                color: '{surface.900}',
                disabledColor: '{surface.600}',
                placeholderColor: '{surface.600}',
                invalidPlaceholderColor: token.var('colors.red.800'),
                floatLabelColor: '{surface.600}',
                floatLabelFocusColor: '{primary.600}',
                floatLabelActiveColor: '{surface.600}',
                floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
                iconColor: '{surface.600}',
                shadow: 'none',
            },
            text: {
                color: '{surface.900}',
                hoverColor: '{surface.900}',
                mutedColor: '{surface.600}',
                hoverMutedColor: '{surface.600}',
            },
            content: {
                background: '{surface.0}',
                hoverBackground: '{surface.100}',
                borderColor: '{surface.300}',
                color: '{text.color}',
                hoverColor: '{text.hover.color}',
            },
            overlay: {
                select: {
                    background: '{surface.0}',
                    borderColor: '{surface.0}',
                    color: '{text.color}',
                },
                popover: {
                    background: '{surface.0}',
                    borderColor: '{surface.0}',
                    color: '{text.color}',
                },
                modal: {
                    background: '{surface.0}',
                    borderColor: '{surface.0}',
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
                        color: '{surface.600}',
                        focusColor: '{surface.600}',
                    },
                },
                optionGroup: {
                    background: 'transparent',
                    color: '{text.color}',
                },
            },
            navigation: {
                item: {
                    focusBackground: '{surface.100}',
                    activeBackground: '{surface.200}',
                    color: '{text.color}',
                    focusColor: '{text.hover.color}',
                    activeColor: '{text.hover.color}',
                    icon: {
                        color: '{surface.600}',
                        focusColor: '{surface.600}',
                        activeColor: '{surface.600}',
                    },
                },
                submenuLabel: {
                    background: 'transparent',
                    color: '{text.color}',
                },
                submenuIcon: {
                    color: '{surface.600}',
                    focusColor: '{surface.600}',
                    activeColor: '{surface.600}',
                },
            },
        },
        dark: {
            focusRing: {
                shadow: '0 0 1px 4px {surface.700}',
            },
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
                filledHoverBackground: '{surface.700}',
                filledFocusBackground: '{surface.800}',
                borderColor: '{surface.600}',
                hoverBorderColor: '{surface.400}',
                focusBorderColor: '{primary.color}',
                invalidBorderColor: token.var('colors.red.300'),
                color: '{surface.0}',
                disabledColor: '{surface.400}',
                placeholderColor: '{surface.400}',
                invalidPlaceholderColor: token.var('colors.red.300'),
                floatLabelColor: '{surface.400}',
                floatLabelFocusColor: '{primary.color}',
                floatLabelActiveColor: '{surface.400}',
                floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
                iconColor: '{surface.400}',
                shadow: 'none',
            },
            text: {
                color: '{surface.0}',
                hoverColor: '{surface.0}',
                mutedColor: '{surface.400}',
                hoverMutedColor: '{surface.400}',
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
                    borderColor: '{surface.900}',
                    color: '{text.color}',
                },
                popover: {
                    background: '{surface.900}',
                    borderColor: '{surface.900}',
                    color: '{text.color}',
                },
                modal: {
                    background: '{surface.900}',
                    borderColor: '{surface.900}',
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
                        color: '{surface.400}',
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
                    activeBackground: '{surface.700}',
                    color: '{text.color}',
                    focusColor: '{text.hover.color}',
                    activeColor: '{text.hover.color}',
                    icon: {
                        color: '{surface.400}',
                        focusColor: '{surface.400}',
                        activeColor: '{surface.400}',
                    },
                },
                submenuLabel: {
                    background: 'transparent',
                    color: '{text.muted.color}',
                },
                submenuIcon: {
                    color: '{surface.400}',
                    focusColor: '{surface.400}',
                    activeColor: '{surface.400}',
                },
            },
        },
    },
};

const Panda: Preset<{ semantic: typeof semantic }> = {
    components: Material.components,
    semantic,
};

export default Panda;
