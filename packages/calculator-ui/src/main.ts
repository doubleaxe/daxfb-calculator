import '../generated/styled-system/styles.css';
import './index.css';

import { preInitApplication } from '@doubleaxe/daxfb-calculator-core/ui/PreInitApplication.js';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';

import App from './App.vue';

const app = createApp(App);

preInitApplication(app);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.daxfb-dark',
            cssLayer: { name: 'primevue', order: 'reset, base, primevue, tokens, recipes, utilities' },
        },
    },
});

app.mount('#root');
