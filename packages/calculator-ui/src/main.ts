import './index.css';
import './panda.css';

import { initApplication } from '@doubleaxe/daxfb-calculator-core/ui/init';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';

import App from './App.vue';

initApplication();

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
            cssLayer: { name: 'primevue' },
        },
    },
});

app.mount('#root');
