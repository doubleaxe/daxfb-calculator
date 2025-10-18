import { css } from '@doubleaxe/daxfb-calculator-styles/css';

const styles = css({
    cursor: 'grab',
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
    borderRadius: '4px',

    _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 12px var(--daxfb-shadow-hover-color)',
    },

    _selected: {
        transform: 'scale(1.05)',
    },

    _light: {
        _hover: {
            borderColor: 'var(--mantine-primary-color-1)',
        },
        _selected: { borderColor: 'var(--mantine-primary-color-2)' },
    },
    _dark: {
        _hover: {
            borderColor: 'var(--mantine-primary-color-9)',
        },
        _selected: { borderColor: 'var(--mantine-primary-color-8)' },
    },
});

export default styles;
