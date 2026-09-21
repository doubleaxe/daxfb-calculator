import { cva, type RecipeVariant } from '@doubleaxe/daxfb-calculator-styles/css';

export const StatusIconColor = cva({
    variants: {
        color: {
            ConnectionOrigin: {
                _light: {
                    fill: 'var(--p-indigo-600)',
                },
                _dark: {
                    fill: 'var(--p-indigo-300)',
                },
            },
            ConnectionDest: {
                _light: {
                    fill: 'var(--p-green-600)',
                },
                _dark: {
                    fill: 'var(--p-green-300)',
                },
            },
            PossibleDest: {
                _light: {
                    fill: 'var(--p-yellow-600)',
                },
                _dark: {
                    fill: 'var(--p-yellow-300)',
                },
            },
            ConnectedDest: {
                _light: {
                    fill: 'var(--p-red-600)',
                },
                _dark: {
                    fill: 'var(--p-red-300)',
                },
            },
        },
    },
});

export type StatusIconColorVariants = RecipeVariant<typeof StatusIconColor>['color'];
