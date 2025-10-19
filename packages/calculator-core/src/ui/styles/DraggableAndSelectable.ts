import { css } from '@doubleaxe/daxfb-calculator-styles/css';

const styles = css({
    cursor: 'grab',
    transition: 'all 0.2s ease',
    border: '3px solid transparent',
    borderRadius: '8px',

    _hover: {
        transform: 'translateY(-2px)',
    },

    _selected: {
        transform: 'scale(1.05)',
    },

    _light: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        _hover: {
            borderColor: 'var(--mantine-primary-color-1)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-mix-blue-2) / 0.4)',
        },
        _selected: { borderColor: 'var(--mantine-primary-color-2)' },
    },
    _dark: {
        boxShadow: '0 2px 4px rgba(255, 255, 255, 0.2)',
        _hover: {
            borderColor: 'var(--mantine-primary-color-9)',
            boxShadow: '0 4px 12px rgb(var(--mantine-color-mix-blue-6) / 0.4)',
        },
        _selected: { borderColor: 'var(--mantine-primary-color-8)' },
    },
});

export default styles;
