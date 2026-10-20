import { defineSemanticTokens } from '@pandacss/dev';

import { colorScale, fixed, scheme } from './utils.js';

export default defineSemanticTokens({
    colors: {
        primary: {
            ...colorScale('emerald'),
            DEFAULT: scheme('{colors.primary.500}', '{colors.primary.400}'),
            contrast: scheme('{colors.surface.0}', '{colors.surface.900}'),
            hover: scheme('{colors.primary.600}', '{colors.primary.300}'),
            active: scheme('{colors.primary.700}', '{colors.primary.200}'),
        },
        surface: colorScale('slate', 'zinc'),
        highlight: {
            background: scheme('{colors.primary.50}', '{colors.primary.400/16}'),
            focusBackground: scheme('{colors.primary.100}', '{colors.primary.400/24}'),
            DEFAULT: scheme('{colors.primary.700}', 'rgba(255,255,255,.87)'),
            focus: scheme('{colors.primary.800}', 'rgba(255,255,255,.87)'),
        },
        mask: {
            background: scheme('rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)'),
            DEFAULT: fixed('{colors.surface.200}'),
        },
        formField: {
            background: scheme('{colors.surface.0}', '{colors.surface.950}'),
            disabledBackground: scheme('{colors.surface.200}', '{colors.surface.700}'),
            filledBackground: scheme('{colors.surface.50}', '{colors.surface.800}'),
            filledHoverBackground: scheme('{colors.surface.50}', '{colors.surface.800}'),
            filledFocusBackground: scheme('{colors.surface.50}', '{colors.surface.800}'),
            border: scheme('{colors.surface.300}', '{colors.surface.600}'),
            hoverBorder: scheme('{colors.surface.400}', '{colors.surface.500}'),
            focusBorder: fixed('{colors.primary}'),
            invalidBorder: scheme('{colors.red.400}', '{colors.red.300}'),
            DEFAULT: scheme('{colors.surface.700}', '{colors.surface.0}'),
            disabled: scheme('{colors.surface.500}', '{colors.surface.400}'),
            placeholder: scheme('{colors.surface.500}', '{colors.surface.400}'),
            invalidPlaceholder: scheme('{colors.red.600}', '{colors.red.400}'),
            floatLabel: scheme('{colors.surface.500}', '{colors.surface.400}'),
            floatLabelFocus: scheme('{colors.primary.600}', '{colors.primary}'),
            floatLabelActive: scheme('{colors.surface.500}', '{colors.surface.400}'),
            floatLabelInvalid: fixed('{colors.formField.invalidPlaceholder}'),
            icon: fixed('{colors.surface.400}'),
        },
        text: {
            DEFAULT: scheme('{colors.surface.700}', '{colors.surface.0}'),
            hover: scheme('{colors.surface.800}', '{colors.surface.0}'),
            muted: scheme('{colors.surface.500}', '{colors.surface.400}'),
            hoverMuted: scheme('{colors.surface.600}', '{colors.surface.300}'),
        },
        content: {
            background: scheme('{colors.surface.0}', '{colors.surface.900}'),
            hoverBackground: scheme('{colors.surface.100}', '{colors.surface.800}'),
            border: scheme('{colors.surface.200}', '{colors.surface.700}'),
            DEFAULT: fixed('{colors.text}'),
            hover: fixed('{colors.text.hover}'),
        },
        overlay: {
            select: {
                background: scheme('{colors.surface.0}', '{colors.surface.900}'),
                border: scheme('{colors.surface.200}', '{colors.surface.700}'),
                DEFAULT: fixed('{colors.text}'),
            },
            popover: {
                background: scheme('{colors.surface.0}', '{colors.surface.900}'),
                border: scheme('{colors.surface.200}', '{colors.surface.700}'),
                DEFAULT: fixed('{colors.text}'),
            },
            modal: {
                background: scheme('{colors.surface.0}', '{colors.surface.900}'),
                border: scheme('{colors.surface.200}', '{colors.surface.700}'),
                DEFAULT: fixed('{colors.text}'),
            },
        },
        list: {
            option: {
                focusBackground: scheme('{colors.surface.100}', '{colors.surface.800}'),
                selectedBackground: fixed('{colors.highlight.background}'),
                selectedFocusBackground: fixed('{colors.highlight.focusBackground}'),
                DEFAULT: fixed('{colors.text}'),
                focus: fixed('{colors.text.hover}'),
                selected: fixed('{colors.highlight}'),
                selectedFocus: fixed('{colors.highlight.focus}'),
                icon: {
                    DEFAULT: scheme('{colors.surface.400}', '{colors.surface.500}'),
                    focus: scheme('{colors.surface.500}', '{colors.surface.400}'),
                },
            },
            optionGroup: {
                background: fixed('transparent'),
                DEFAULT: fixed('{colors.text.muted}'),
            },
        },
        navigation: {
            item: {
                focusBackground: scheme('{colors.surface.100}', '{colors.surface.800}'),
                activeBackground: scheme('{colors.surface.100}', '{colors.surface.800}'),
                DEFAULT: fixed('{colors.text}'),
                focus: fixed('{colors.text.hover}'),
                active: fixed('{colors.text.hover}'),
                icon: {
                    DEFAULT: scheme('{colors.surface.400}', '{colors.surface.500}'),
                    focus: scheme('{colors.surface.500}', '{colors.surface.400}'),
                    active: scheme('{colors.surface.500}', '{colors.surface.400}'),
                },
            },
            submenuLabel: {
                background: fixed('transparent'),
                DEFAULT: fixed('{colors.text.muted}'),
            },
            submenuIcon: {
                DEFAULT: scheme('{colors.surface.400}', '{colors.surface.500}'),
                focus: scheme('{colors.surface.500}', '{colors.surface.400}'),
                active: scheme('{colors.surface.500}', '{colors.surface.400}'),
            },
        },
    },
});
