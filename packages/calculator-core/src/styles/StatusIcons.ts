import { cva, type RecipeVariant } from '@doubleaxe/daxfb-calculator-styles/css';

export const StatusIconColor = cva({
    variants: {
        color: {
            ConnectionOrigin: {
                _light: {
                    fill: 'var(--mantine-color-indigo-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-indigo-3)',
                },
            },
            ConnectionDest: {
                _light: {
                    fill: 'var(--mantine-color-green-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-green-3)',
                },
            },
            PossibleDest: {
                _light: {
                    fill: 'var(--mantine-color-yellow-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-yellow-3)',
                },
            },
            ConnectedDest: {
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
