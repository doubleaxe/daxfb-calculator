import type { CSSVariablesResolver } from '@mantine/core';
import { DEFAULT_THEME, MantineProvider, toRgba } from '@mantine/core';

import type { BaseProps } from '#core/types/props';

const mantineColorsMix = Object.entries(DEFAULT_THEME.colors)
    .map(([color, array]) =>
        array.map((c, i) => {
            const { r, g, b } = toRgba(c);
            return [`--mantine-color-rgb-${color}-${i}`, `${r} ${g} ${b}`];
        })
    )
    .flat();

const resolver: CSSVariablesResolver = () => ({
    variables: {
        ...(Object.fromEntries(mantineColorsMix) as Record<string, string>),
    },
    light: {},
    dark: {},
});

export default function MantineInit({ children }: BaseProps) {
    return (
        <MantineProvider cssVariablesResolver={resolver} defaultColorScheme='auto'>
            {children}
        </MantineProvider>
    );
}
