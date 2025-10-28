import { css } from '@doubleaxe/daxfb-calculator-styles/css';

const styles = css({
    '&[data-dragging]': {
        cursor: 'grab!',
        border: '2px solid',
        transform: 'scale(1.02)',
        opacity: 0.8,

        _light: {
            borderColor: 'var(--mantine-color-teal-4)',
            boxShadow: '0 6px 18px rgb(var(--mantine-color-rgb-teal-4) / 0.6)',
        },
        _dark: {
            border: 'var(--mantine-color-teal-6)',
            boxShadow: '0 6px 18px rgb(var(--mantine-color-rgb-teal-6) / 0.6)',
        },
    },
});

export default styles;
