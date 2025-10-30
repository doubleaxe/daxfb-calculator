import { css, cva } from '@doubleaxe/daxfb-calculator-styles/css';

const selected = css.raw({
    _light: {
        borderColor: 'var(--mantine-color-blue-4)',
        boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-4) / 0.6)',
    },
    _dark: {
        borderColor: 'var(--mantine-color-blue-6)',
        boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-6) / 0.6)',
    },
});

const hover = css.raw({
    _light: {
        borderColor: 'rgb(var(--mantine-color-rgb-blue-3) / 0.5)',
        boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-3) / 0.6)',
    },
    _dark: {
        borderColor: 'rgb(var(--mantine-color-rgb-blue-7) / 0.5)',
        boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-7) / 0.6)',
    },
    _selected: selected,
});

export const draggableSelectableStyles = cva({
    base: {
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '2px solid',
        boxSizing: 'border-box',
        touchAction: 'none',
        userSelect: 'none',
        _selected: {
            position: 'relative',
            zIndex: 1,
            ...selected,
        },
    },
    variants: {
        hover: {
            cursor: {
                cursor: 'grab',
                _hover: hover,
            },
            child: {
                '&:has([data-hoverable]:hover):not([data-dragging])': hover,
            },
        },
        transition: {
            lift: {
                _hover: {
                    transform: 'translateY(-2px)',
                    _selected: {
                        transform: 'translateY(-2px) scale(1.05)',
                    },
                },
                _selected: {
                    transform: 'scale(1.05)',
                },
            },
            glow: {},
        },
    },
});
