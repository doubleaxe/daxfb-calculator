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

const game = process.env['GAME'] || 'example';
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
