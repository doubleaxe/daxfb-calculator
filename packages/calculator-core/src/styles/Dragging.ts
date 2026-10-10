import { css } from '@daxfb/styles/css';

export const draggingStyle = css({
    '&[data-dragging]': {
        cursor: 'grabbing!',
        border: '2px solid',
        transform: 'scale(1.02)',
        opacity: 0.8,

        _light: {
            borderColor: 'teal.400',
            boxShadow: '0 6px 18px {colors.teal.400/60}',
        },
        _dark: {
            borderColor: 'teal.600',
            boxShadow: '0 6px 18px {colors.teal.600/60}',
        },
    },
});
