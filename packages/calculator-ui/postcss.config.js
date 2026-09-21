import postcss from '@pandacss/dev/postcss';
import autoprefixer from 'autoprefixer';

export default {
    plugins: [autoprefixer(), postcss()],
};
