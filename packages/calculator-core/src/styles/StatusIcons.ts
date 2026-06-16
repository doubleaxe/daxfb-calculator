import { cva, type RecipeVariant } from '@doubleaxe/daxfb-calculator-styles/css';

export const StatusIconColor = cva({
    variants: {
        color: {
            Source: {
                _light: {
                    fill: 'var(--mantine-color-indigo-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-indigo-3)',
                },
            },
            Target: {
                _light: {
                    fill: 'var(--mantine-color-green-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-green-3)',
                },
            },
            PossibleTarget: {
                _light: {
                    fill: 'var(--mantine-color-yellow-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-yellow-3)',
                },
            },
            ConnectedTarget: {
                _light: {
                    fill: 'var(--mantine-color-red-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-red-3)',
                },
            },
        },
    },
});

export type StatusIconColorVariants = RecipeVariant<typeof StatusIconColor>['color'];
