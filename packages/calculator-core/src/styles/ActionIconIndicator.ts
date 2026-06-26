import { css } from '@doubleaxe/daxfb-calculator-styles/css';

export const actionIconIndicatorStyle = css.raw({
    minWidth: 'auto',
    minHeight: 'auto',
    width: '100%',
    height: '100%',
    _light: {
        filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 1)) drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.8))',
    },
    _dark: {
        filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.9)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.7))',
    },
    willChange: 'filter',
    animationStyle: 'scaleBurst',
});
