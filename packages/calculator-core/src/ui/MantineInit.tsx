import type { CSSVariablesResolver } from '@mantine/core';
import { alpha, DEFAULT_THEME, MantineProvider } from '@mantine/core';

import type { BaseProps } from '#core/types/props';

const resolver: CSSVariablesResolver = () => ({
    variables: {},
    light: {
        '--daxfb-shadow-hover-color': alpha(DEFAULT_THEME.colors.blue[2] ?? '', 0.4),
    },
    dark: {
        '--daxfb-shadow-hover-color': alpha(DEFAULT_THEME.colors.blue[6] ?? '', 0.4),
    },
});

export default function MantineInit({ children }: BaseProps) {
    return (
        <MantineProvider cssVariablesResolver={resolver} defaultColorScheme='auto'>
            {children}
        </MantineProvider>
    );
}
