import { css } from '@doubleaxe/daxfb-calculator-styles/css';

export const draggingStyle = css({
    '&[data-dragging]': {
        cursor: 'grabbing!',
        border: '2px solid',
        transform: 'scale(1.02)',
        opacity: 0.8,

        _light: {
            borderColor: 'var(--p-teal-400)',
            boxShadow: '0 6px 18px color-mix(in srgb, var(--p-teal-400) 60%, transparent)',
        },
        _dark: {
            borderColor: 'var(--p-teal-600)',
            boxShadow: '0 6px 18px color-mix(in srgb, var(--p-teal-600) 60%, transparent)',
        },
    },
});
