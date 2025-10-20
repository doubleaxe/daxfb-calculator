import { css } from '@doubleaxe/daxfb-calculator-styles/css';

const styles = css({
    cursor: 'grab',
    borderRadius: '8px',
    transform: 'rotate(5deg) scale(1.1)',
    opacity: 0.8,

    _light: {
        border: '3px solid var(--mantine-color-teal-4)',
        boxShadow: '0 6px 18px rgb(var(--mantine-color-rgb-teal-4) / 0.6)',
    },
    _dark: {
        border: '3px solid var(--mantine-color-teal-8)',
        boxShadow: '0 6px 18px rgb(var(--mantine-color-rgb-teal-8) / 0.6)',
    },
});

export default styles;
