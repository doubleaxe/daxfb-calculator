import {fileURLToPath, URL} from 'node:url';

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
//import analyze from 'rollup-plugin-analyzer';
import {visualizer} from 'rollup-plugin-visualizer';
import Components from 'unplugin-vue-components/vite';
import {
    NaiveUiResolver,
    VueUseComponentsResolver,
    VueUseDirectiveResolver
} from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                NaiveUiResolver(),
                VueUseComponentsResolver(),
                VueUseDirectiveResolver(),
            ]
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            plugins: [visualizer()],
        },
        minify: false,
    },
});
