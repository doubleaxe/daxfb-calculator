import { css } from '@doubleaxe/daxfb-calculator-styles/css';

const styles = css({
    cursor: 'grab',
    transition: 'all 0.2s ease',
    border: '3px solid transparent',
    borderRadius: '8px',
    boxSizing: 'border-box',

    _hover: {
        transform: 'translateY(-2px)',
        _selected: {
            transform: 'translateY(-2px) scale(1.1)',
        },
    },

    _selected: {
        transform: 'scale(1.1)',
        position: 'relative',
        zIndex: 1,
    },

    _light: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        _hover: {
            borderColor: 'var(--mantine-color-blue-1)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-2) / 0.4)',
            _selected: {
                borderColor: 'var(--mantine-color-blue-4)',
                boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-4) / 0.6)',
            },
        },
        _selected: {
            borderColor: 'var(--mantine-color-blue-4)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-4) / 0.6)',
        },
    },
    _dark: {
        boxShadow: '0 2px 4px rgba(255, 255, 255, 0.2)',
        _selected: {
            borderColor: 'var(--mantine-color-blue-8)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-8) / 0.6)',
        },
        _hover: {
            borderColor: 'rgb(var(--mantine-color-rgb-blue-5) / 0.2)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-6) / 0.4)',
            _selected: {
                borderColor: 'var(--mantine-color-blue-8)',
                boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-8) / 0.6)',
            },
        },
    },
});

export default styles;
