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

//const __VERSION__ = import.meta.env.VITE_VERSION;
process.env['VITE_VERSION'] = pkg.version;
//const __BUILD_TIME__ = import.meta.env.VITE_BUILD_TIME;
process.env['VITE_BUILD_TIME'] = new Date().toISOString();

const _dirname = path.join(path.dirname(fileURLToPath(import.meta.url)));

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
            '@': path.join(_dirname, 'src'),
            '#types': path.join(_dirname, 'data/types'),
        },
    },
    build: {
        outDir: path.join(_dirname, '../dist'),
        emptyOutDir: true,
        rollupOptions: {
            plugins: [visualizer({
                filename: path.join(_dirname, '../tmp/stats.html'),
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
