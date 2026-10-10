import { cva, type RecipeVariant } from '@daxfb/styles/css';

export const StatusIconColor = cva({
    variants: {
        color: {
            ConnectionOrigin: {
                _light: {
                    fill: 'indigo.600',
                },
                _dark: {
                    fill: 'indigo.300',
                },
            },
            ConnectionDest: {
                _light: {
                    fill: 'green.600',
                },
                _dark: {
                    fill: 'green.300',
                },
            },
            PossibleDest: {
                _light: {
                    fill: 'yellow.600',
                },
                _dark: {
                    fill: 'yellow.300',
                },
            },
            ConnectedDest: {
                _light: {
                    fill: 'red.600',
                },
                _dark: {
                    fill: 'red.300',
                },
            },
        },
    },
});

export type StatusIconColorVariants = RecipeVariant<typeof StatusIconColor>['color'];
