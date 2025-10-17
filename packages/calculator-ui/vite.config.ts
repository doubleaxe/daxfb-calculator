import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env['VITE_VERSION'] = pkg.version;
process.env['VITE_BUILD_TIME'] = new Date().toISOString();

// node --inspect-brk node_modules/vite/bin/vite.js
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    esbuild: { legalComments: 'none' },
    build: {
        emptyOutDir: true,
        rollupOptions: {
            plugins: [
                visualizer({
                    filename: path.join(__dirname, './dist/stats.html'),
                }),
            ],
        },
    },
});
