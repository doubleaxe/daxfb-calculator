import {fileURLToPath, URL} from 'node:url';

import {defineConfig} from 'vite';
import type {IndexHtmlTransformHook} from 'vite';
import vue from '@vitejs/plugin-vue';
//import analyze from 'rollup-plugin-analyzer';
import {visualizer} from 'rollup-plugin-visualizer';
import Components from 'unplugin-vue-components/vite';
import {
    Vuetify3Resolver,
    VueUseComponentsResolver,
    VueUseDirectiveResolver
} from 'unplugin-vue-components/resolvers';

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
            ]
        }),
        htmlPlugin(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            plugins: [visualizer()],
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
