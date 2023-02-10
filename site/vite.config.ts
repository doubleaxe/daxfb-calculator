import {fileURLToPath} from 'node:url';
import * as path from 'node:path';

import {defineConfig} from 'vite';
import type {IndexHtmlTransformHook} from 'vite';
import vue from '@vitejs/plugin-vue';
//import analyze from 'rollup-plugin-analyzer';
import {visualizer} from 'rollup-plugin-visualizer';
import Components from 'unplugin-vue-components/vite';
import {
    Vuetify3Resolver,
    VueUseComponentsResolver,
    VueUseDirectiveResolver,
} from 'unplugin-vue-components/resolvers';
import pkg from '../package.json';

//GAME=example TRACK=1 npm run build
const game = process.env['GAME'] || 'example';
const tracking = process.env['TRACK'];

//const __GAME__ = import.meta.env.VITE_GAME;
process.env['VITE_GAME'] = game;
//const __VERSION__ = import.meta.env.VITE_VERSION;
process.env['VITE_VERSION'] = pkg.version;
//const __BUILD_TIME__ = import.meta.env.VITE_BUILD_TIME;
process.env['VITE_BUILD_TIME'] = new Date().toISOString();
//const __TRACK__ = import.meta.env.VITE_TRACK;
process.env['VITE_TRACK'] = tracking ? '1' : '';

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));

const htmlPlugin = () => {
    const transformIndexHtml: IndexHtmlTransformHook = (html) => {
        return html.replace('type="module" crossorigin', 'async');
    };
    return {
        name: 'html-transform',
        transformIndexHtml,
    };
};

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        vue(),
        Components({
            resolvers: [
                Vuetify3Resolver(),
                VueUseComponentsResolver(),
                VueUseDirectiveResolver(),
            ],
        }),
        htmlPlugin(),
    ],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    build: {
        outDir: path.join(__dirname, `../dist/${game}`),
        emptyOutDir: true,
        rollupOptions: {
            plugins: [visualizer({
                filename: path.join(__dirname, '../dist/stats.html'),
            })],
            output: {
                format: 'iife',
            },
        },
        target: 'es2018',
        minify: true,
        sourcemap: true,
        cssCodeSplit: false,
    },
});
