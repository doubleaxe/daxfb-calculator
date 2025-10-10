import type { CSSVariablesResolver } from '@mantine/core';
import { MantineProvider } from '@mantine/core';

import type { BaseProps } from '#core/types/props';

const resolver: CSSVariablesResolver = () => ({
    variables: {},
    light: {
        '--mantine-color-primary-shadow': 'var(--mantine-color-blue-2)',
    },
    dark: {
        '--mantine-color-primary-shadow': 'var(--mantine-color-blue-7)',
    },
});

export default function MantineInit({ children }: BaseProps) {
    return (
        <MantineProvider cssVariablesResolver={resolver} defaultColorScheme='auto'>
            {children}
        </MantineProvider>
    );
}
