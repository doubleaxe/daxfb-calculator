import { css } from '@doubleaxe/daxfb-calculator-styles/css';

const styles = css({
    cursor: 'grab!',
    borderRadius: '8px',
    transform: 'scale(1.02) rotate(2deg)',
    opacity: 0.8,
    backgroundColor: 'var(--mantine-color-body)',

    transition: 'all 0.1s ease',
    animation: 'pulse 1.5s ease-in-out infinite',

    _light: {
        border: '2px solid var(--mantine-color-teal-4)',
        boxShadow: '0 6px 18px rgb(var(--mantine-color-rgb-teal-4) / 0.6)',
    },
    _dark: {
        border: '2px solid var(--mantine-color-teal-6)',
        boxShadow: '0 6px 18px rgb(var(--mantine-color-rgb-teal-6) / 0.6)',
    },
});

export default styles;
