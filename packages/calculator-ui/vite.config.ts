import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import pkg from './package.json' with { type: 'json' };

process.env['VITE_VERSION'] = pkg.version;
process.env['VITE_BUILD_TIME'] = new Date().toISOString();

// node --inspect-brk node_modules/vite/bin/vite.js
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    esbuild: { legalComments: 'none' },
    build: {
        emptyOutDir: true,
        rollupOptions: {
            plugins: [],
        },
    },
});
