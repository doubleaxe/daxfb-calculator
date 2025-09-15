import reactTs from '@doubleaxe/eslint-config/react-ts';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    reactTs.configs.esNextTools,
    {
        name: 'web',
        basePath: 'packages/calculator',
        extends: [reactTs.configs.reactTs, reactTs.configs.browser],
    },
    {
        name: 'shared',
        basePath: 'packages/shared',
        extends: [reactTs.configs.ts],
    },
    {
        name: 'node',
        basePath: 'packages/gamedata',
        extends: [reactTs.configs.ts, reactTs.configs.node],
    },
]);
