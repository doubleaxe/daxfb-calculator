import { css } from '@doubleaxe/daxfb-calculator-styles/css';

const styles = css({
    'cursor': 'grab',
    'transition': 'all 0.2s ease',
    'border': '2px solid transparent',
    'borderRadius': '4px',

    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 12px var(--daxfb-shadow-hover-color)',
    },

    '&[data-selected="true"]': {
        transform: 'scale(1.05)',
    },

    '_light': {
        '&:hover': {
            borderColor: 'var(--mantine-primary-color-1)',
        },
    },
    '_dark': {
        '&:hover': {
            borderColor: 'var(--mantine-primary-color-9)',
        },
    },
});

export default styles;
