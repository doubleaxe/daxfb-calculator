import { css } from '@doubleaxe/daxfb-calculator-styles/css';

const styles = css({
    cursor: 'grab',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '2px solid transparent',
    borderRadius: '8px',
    boxSizing: 'border-box',

    _light: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    _dark: {
        boxShadow: '0 2px 4px rgba(255, 255, 255, 0.2)',
    },

    _hover: {
        transform: 'translateY(-2px)',
        _light: {
            borderColor: 'rgb(var(--mantine-color-rgb-blue-3) / 0.5)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-3) / 0.6)',
        },
        _dark: {
            borderColor: 'rgb(var(--mantine-color-rgb-blue-7) / 0.5)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-7) / 0.4)',
        },
        _selected: {
            transform: 'translateY(-2px) scale(1.05)',
            _light: {
                borderColor: 'var(--mantine-color-blue-4)',
                boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-4) / 0.6)',
            },
            _dark: {
                borderColor: 'var(--mantine-color-blue-6)',
                boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-6) / 0.6)',
            },
        },
    },

    _selected: {
        transform: 'scale(1.05)',
        position: 'relative',
        zIndex: 1,
        _light: {
            borderColor: 'var(--mantine-color-blue-4)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-4) / 0.6)',
        },
        _dark: {
            borderColor: 'var(--mantine-color-blue-6)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-rgb-blue-6) / 0.6)',
        },
    },
});

export default styles;
