import { defineConfig } from '@pandacss/dev';

const textColor = { _light: 'gray.800', _dark: 'gray.200' };
const headingColor = { _light: 'gray.900', _dark: 'gray.50' };
const mutedColor = { _light: 'gray.600', _dark: 'gray.400' };
const linkColor = { _light: 'green.600', _dark: 'green.400' };
const linkColorHover = { _light: 'green.700', _dark: 'green.300' };
const subtleSurfaceColor = { _light: 'gray.100', _dark: 'gray.900' };
const borderColor = { _light: 'gray.200', _dark: 'gray.700' };

export default defineConfig({
    globalCss: {
        'html': {
            fontFamily: 'sans',
            fontSize: 'md',
            lineHeight: 'normal',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
            textSizeAdjust: '100%',
        },

        'body': {
            margin: 0,
            fontFamily: 'sans',
            fontSize: 'md',
            lineHeight: 'relaxed',
            color: { _light: 'gray.800', _dark: 'gray.200' },
            backgroundColor: { _light: 'white', _dark: 'gray.950' },
        },

        '::selection': {
            backgroundColor: { _light: 'green.200', _dark: 'green.800' },
            color: headingColor,
        },

        'h1, h2, h3, h4, h5, h6': {
            margin: 0,
            marginBlockEnd: '3',
            fontFamily: 'sans',
            fontWeight: 'bold',
            lineHeight: 'tight',
            color: headingColor,
            textWrap: 'balance',
        },
        'h1': {
            fontSize: '4xl',
            letterSpacing: 'tight',
        },
        'h2': {
            fontSize: '3xl',
            letterSpacing: 'tight',
        },
        'h3': {
            fontSize: '2xl',
        },
        'h4': {
            fontSize: 'xl',
        },
        'h5': {
            fontSize: 'lg',
        },
        'h6': {
            fontSize: 'md',
            fontWeight: 'semibold',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
        },

        'p': {
            margin: 0,
            marginBlockEnd: '4',
            fontSize: 'md',
            lineHeight: 'relaxed',
            color: 'inherit',
            textWrap: 'pretty',
        },

        'a': {
            'color': linkColor,
            'textDecoration': 'none',
            'transitionProperty': 'color, text-decoration-color',
            'transitionDuration': 'fast',
            'transitionTimingFunction': 'default',
            '&:hover': {
                color: linkColorHover,
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
            },
            '&:focus-visible': {
                outline: '2px solid',
                outlineColor: { _light: 'green.500', _dark: 'green.400' },
                outlineOffset: '2px',
                borderRadius: 'xs',
            },
        },

        'strong, b': {
            fontWeight: 'semibold',
            color: headingColor,
        },
        'em, i': {
            fontStyle: 'italic',
        },
        'small': {
            fontSize: 'sm',
        },
        'sub, sup': {
            fontSize: 'xs',
            lineHeight: 'none',
            position: 'relative',
            verticalAlign: 'baseline',
        },
        'sub': {
            bottom: '-0.25em',
        },
        'sup': {
            top: '-0.5em',
        },
        'del, s': {
            textDecoration: 'line-through',
            color: mutedColor,
        },
        'ins': {
            textDecoration: 'underline',
        },
        'mark': {
            backgroundColor: { _light: 'yellow.200', _dark: 'yellow.800' },
            color: headingColor,
            paddingInline: '1',
            borderRadius: 'xs',
        },
        'abbr': {
            textDecoration: 'underline dotted',
            cursor: 'help',
        },

        'ul, ol': {
            margin: 0,
            marginBlockEnd: '4',
            paddingInlineStart: '6',
            lineHeight: 'relaxed',
        },
        'ul': {
            listStyleType: 'disc',
        },
        'ol': {
            listStyleType: 'decimal',
        },
        'li': {
            marginBlockEnd: '1',
        },
        'li > ul, li > ol': {
            marginBlockStart: '1',
            marginBlockEnd: 0,
        },
        'ul ul, ul ol, ol ul, ol ol': {
            marginBlockEnd: 0,
        },

        'code, kbd, samp': {
            fontFamily: 'mono',
            fontSize: 'sm',
            backgroundColor: subtleSurfaceColor,
            color: { _light: 'pink.600', _dark: 'pink.300' },
            paddingInline: '1',
            paddingBlock: '0.5',
            borderRadius: 'sm',
        },
        'pre code, pre kbd, pre samp': {
            backgroundColor: 'transparent',
            color: 'inherit',
            fontSize: 'inherit',
            padding: 0,
            borderRadius: 0,
        },
        'pre': {
            margin: 0,
            marginBlockEnd: '4',
            fontFamily: 'mono',
            fontSize: 'sm',
            lineHeight: 'normal',
            padding: '4',
            overflowX: 'auto',
            backgroundColor: subtleSurfaceColor,
            color: textColor,
            borderRadius: 'md',
        },
        'kbd': {
            fontFamily: 'mono',
            fontSize: 'xs',
            lineHeight: 'none',
        },

        'blockquote': {
            margin: 0,
            marginBlockEnd: '4',
            paddingInlineStart: '4',
            borderInlineStartWidth: '3px',
            borderInlineStartStyle: 'solid',
            borderInlineStartColor: { _light: 'green.400', _dark: 'green.600' },
            color: mutedColor,
            fontStyle: 'italic',
        },

        'hr': {
            margin: 0,
            marginBlock: '6',
            border: 'none',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: borderColor,
        },

        'table': {
            width: 'full',
            marginBlockEnd: '4',
            borderCollapse: 'collapse',
            fontSize: 'sm',
            textAlign: 'left',
        },
        'caption': {
            marginBlockEnd: '2',
            color: mutedColor,
            fontSize: 'sm',
        },
        'th, td': {
            paddingInline: '3',
            paddingBlock: '2',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: borderColor,
            verticalAlign: 'top',
        },
        'th': {
            fontWeight: 'semibold',
            color: headingColor,
        },

        'img, svg, video, canvas': {
            display: 'block',
            verticalAlign: 'middle',
            maxWidth: 'full',
            height: 'auto',
        },
        'figure': {
            margin: 0,
            marginBlockEnd: '4',
        },
        'figcaption': {
            marginBlockStart: '2',
            fontSize: 'sm',
            color: mutedColor,
        },
    },
});
