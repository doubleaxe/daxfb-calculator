export function colorScale(paletteLight: string, paletteDark?: string) {
    return Object.fromEntries(
        [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => {
            const lightColor = step === 0 ? '{colors.white}' : `{colors.${paletteLight}.${step}}`;
            let darkColor = '';
            if (paletteDark) darkColor = step === 0 ? '{colors.white}' : `{colors.${paletteDark}.${step}}`;
            const palette = paletteDark ? { _light: lightColor, _dark: darkColor } : lightColor;
            return [
                step,
                {
                    value: palette,
                },
            ] as const;
        })
    );
}

export const scheme = (light: string, dark: string) => ({ value: { _light: light, _dark: dark } });
export const fixed = (value: string) => ({ value });
