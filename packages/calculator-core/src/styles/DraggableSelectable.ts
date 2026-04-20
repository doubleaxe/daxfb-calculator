import { css, cva } from '@doubleaxe/daxfb-calculator-styles/css';

const selectedBase = css.raw({
    _light: {
        borderColor: 'var(--mantine-color-blue-4)',
        boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-4) / 0.6)',
    },
    _dark: {
        borderColor: 'var(--mantine-color-blue-6)',
        boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-6) / 0.6)',
    },
});

const selected = css.raw({
    position: 'relative',
    zIndex: 1,
    ...selectedBase,
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
});

export const draggableSelectableStyles = cva({
    base: {
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '2px solid',
        boxSizing: 'border-box',
        touchAction: 'none',
        userSelect: 'none',
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
        select: {
            data: {
                _selected: selected,
                _hover: {
                    _selected: selectedBase,
                },
            },
            flow: {
                '&:has(.clickconnecting)': selected,
                '_hover': {
                    '&:has(.clickconnecting)': selectedBase,
                },
            },
        },
        transition: {
            lift: {
                _hover: {
                    transform: 'translateY(-2px)',
                },
            },
            none: {},
        },
    },
    compoundVariants: [
        {
            select: 'data',
            transition: 'lift',
            css: {
                _hover: {
                    _selected: {
                        transform: 'translateY(-2px) scale(1.05)',
                    },
                },
                _selected: {
                    transform: 'scale(1.05)',
                },
            },
        },
        {
            select: 'flow',
            transition: 'lift',
            css: {
                '_hover': {
                    '&:has(.clickconnecting)': {
                        transform: 'translateY(-2px) scale(1.05)',
                    },
                },
                '&:has(.clickconnecting)': {
                    transform: 'scale(1.05)',
                },
            },
        },
    ],
});
