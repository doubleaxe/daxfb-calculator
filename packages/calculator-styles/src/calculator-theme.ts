import { defineAnimationStyles, definePreset } from '@pandacss/dev';

const surfaceScale = Object.fromEntries(
    ([0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const).map((step) => [
        step,
        {
            value:
                step === 0
                    ? { _light: '{colors.white}', _dark: '{colors.white}' }
                    : { _light: `{colors.slate.${step}}`, _dark: `{colors.zinc.${step}}` },
        },
    ])
);

export default definePreset({
    name: 'calcilator',
    theme: {
        semanticTokens: {
            colors: {
                text: {
                    value: {
                        _light: '{colors.slate.700}',
                        _dark: '{colors.white}',
                    },
                },
                primary: {
                    DEFAULT: {
                        value: {
                            _light: '{colors.emerald.500}',
                            _dark: '{colors.emerald.400}',
                        },
                    },
                    contrast: {
                        value: {
                            _light: '{colors.white}',
                            _dark: '{colors.zinc.900}',
                        },
                    },
                },
                content: {
                    background: {
                        value: {
                            _light: '{colors.white}',
                            _dark: '{colors.zinc.900}',
                        },
                    },
                },
                border: {
                    value: {
                        _light: '{colors.slate.200}',
                        _dark: '{colors.zinc.700}',
                    },
                },
                surface: surfaceScale,
            },
            shadows: {
                scaleBurstShadow: {
                    value: {
                        _light: 'drop-shadow(0px 0px 25px rgba(255, 255, 255, 1)) drop-shadow(0px 0px 10px rgba(255, 255, 255, 1))',
                        _dark: 'drop-shadow(0px 0px 25px rgba(0, 0, 0, 1)) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.9))',
                    },
                },
            },
        },
        keyframes: {
            scaleBurst: {
                '0%': {
                    transform: 'scale(0.5)',
                    filter: 'token(shadows.scaleBurstShadow)',
                },
                '50%': {
                    transform: 'scale(1.15)',
                },
                '100%': {
                    transform: 'scale(1)',
                },
            },
        },
        animationStyles: defineAnimationStyles({
            scaleBurst: {
                value: {
                    animationName: 'scaleBurst',
                    animationDuration: '0.6s',
                    animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animationFillMode: 'forwards',
                },
            },
        }),
    },
});
