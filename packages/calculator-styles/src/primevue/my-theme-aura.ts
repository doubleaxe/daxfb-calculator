import { token } from '@daxfb/styles/tokens';
import AuraPreset from '@primeuix/themes/aura';
import type { Preset } from '@primeuix/themes/types';

// panda is the primary source of truth, we build the primevue theme based on it
// override everything, do not merge (definePreset is deepMerge)
// remove now unused base color palette
const Aura = (AuraPreset.default ?? AuraPreset) as Preset;

const colorScale = (color: string) => ({
    0: token.var(`colors.${color}.0`),
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

const colorScheme = {
    primary: {
        color: token.var('colors.primary'),
        contrastColor: token.var('colors.primary.contrast'),
        hoverColor: token.var('colors.primary.hover'),
        activeColor: token.var('colors.primary.active'),
    },
    highlight: {
        background: token.var('colors.highlight.background'),
        focusBackground: token.var('colors.highlight.focusBackground'),
        color: token.var('colors.highlight'),
        focusColor: token.var('colors.highlight.focus'),
    },
    mask: {
        background: token.var('colors.mask.background'),
        color: token.var('colors.mask'),
    },
    formField: {
        background: token.var('colors.formField.background'),
        disabledBackground: token.var('colors.formField.disabledBackground'),
        filledBackground: token.var('colors.formField.filledBackground'),
        filledHoverBackground: token.var('colors.formField.filledHoverBackground'),
        filledFocusBackground: token.var('colors.formField.filledFocusBackground'),
        borderColor: token.var('colors.formField.border'),
        hoverBorderColor: token.var('colors.formField.hoverBorder'),
        focusBorderColor: token.var('colors.formField.focusBorder'),
        invalidBorderColor: token.var('colors.formField.invalidBorder'),
        color: token.var('colors.formField'),
        disabledColor: token.var('colors.formField.disabled'),
        placeholderColor: token.var('colors.formField.placeholder'),
        invalidPlaceholderColor: token.var('colors.formField.invalidPlaceholder'),
        floatLabelColor: token.var('colors.formField.floatLabel'),
        floatLabelFocusColor: token.var('colors.formField.floatLabelFocus'),
        floatLabelActiveColor: token.var('colors.formField.floatLabelActive'),
        floatLabelInvalidColor: token.var('colors.formField.floatLabelInvalid'),
        iconColor: token.var('colors.formField.icon'),
        shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
    },
    text: {
        color: token.var('colors.text'),
        hoverColor: token.var('colors.text.hover'),
        mutedColor: token.var('colors.text.muted'),
        hoverMutedColor: token.var('colors.text.hoverMuted'),
    },
    content: {
        background: token.var('colors.content.background'),
        hoverBackground: token.var('colors.content.hoverBackground'),
        borderColor: token.var('colors.content.border'),
        color: token.var('colors.content'),
        hoverColor: token.var('colors.content.hover'),
    },
    overlay: {
        select: {
            background: token.var('colors.overlay.select.background'),
            borderColor: token.var('colors.overlay.select.border'),
            color: token.var('colors.overlay.select'),
        },
        popover: {
            background: token.var('colors.overlay.popover.background'),
            borderColor: token.var('colors.overlay.popover.border'),
            color: token.var('colors.overlay.popover'),
        },
        modal: {
            background: token.var('colors.overlay.modal.background'),
            borderColor: token.var('colors.overlay.modal.border'),
            color: token.var('colors.overlay.modal'),
        },
    },
    list: {
        option: {
            focusBackground: token.var('colors.list.option.focusBackground'),
            selectedBackground: token.var('colors.list.option.selectedBackground'),
            selectedFocusBackground: token.var('colors.list.option.selectedFocusBackground'),
            color: token.var('colors.list.option'),
            focusColor: token.var('colors.list.option.focus'),
            selectedColor: token.var('colors.list.option.selected'),
            selectedFocusColor: token.var('colors.list.option.selectedFocus'),
            icon: {
                color: token.var('colors.list.option.icon'),
                focusColor: token.var('colors.list.option.icon.focus'),
            },
        },
        optionGroup: {
            background: token.var('colors.list.optionGroup.background'),
            color: token.var('colors.list.optionGroup'),
        },
    },
    navigation: {
        item: {
            focusBackground: token.var('colors.navigation.item.focusBackground'),
            activeBackground: token.var('colors.navigation.item.activeBackground'),
            color: token.var('colors.navigation.item'),
            focusColor: token.var('colors.navigation.item.focus'),
            activeColor: token.var('colors.navigation.item.active'),
            icon: {
                color: token.var('colors.navigation.item.icon'),
                focusColor: token.var('colors.navigation.item.icon.focus'),
                activeColor: token.var('colors.navigation.item.icon.active'),
            },
        },
        submenuLabel: {
            background: token.var('colors.navigation.submenuLabel.background'),
            color: token.var('colors.navigation.submenuLabel'),
        },
        submenuIcon: {
            color: token.var('colors.navigation.submenuIcon'),
            focusColor: token.var('colors.navigation.submenuIcon.focus'),
            activeColor: token.var('colors.navigation.submenuIcon.active'),
        },
    },
};

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
    primary: colorScale('primary'),
    surface: colorScale('surface'),
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
        light: colorScheme,
        dark: colorScheme,
    },
};

const Panda: Preset<{ semantic: typeof semantic }> = {
    components: Aura.components,
    semantic,
};

export default Panda;
