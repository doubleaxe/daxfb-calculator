import { css } from '@doubleaxe/daxfb-calculator-styles/css';

export const draggingStyle = css({
    '&[data-dragging]': {
        cursor: 'grabbing!',
        border: '2px solid',
        transform: 'scale(1.02)',
        opacity: 0.8,

        _light: {
            borderColor: 'var(--mantine-color-teal-4)',
            boxShadow: '0 6px 18px rgb(var(--mantine-color-rgb-teal-4) / 0.6)',
        },
        _dark: {
            borderColor: 'var(--mantine-color-teal-6)',
            boxShadow: '0 6px 18px rgb(var(--mantine-color-rgb-teal-6) / 0.6)',
        },
    },
});
