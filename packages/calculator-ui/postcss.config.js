import autoprefixer from 'autoprefixer';
import mantine from 'postcss-preset-mantine';

export default {
    plugins: [autoprefixer(), mantine()],
};
