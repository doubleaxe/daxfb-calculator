import './panda.css';
import './index.css';

import { preInitApplication } from '@doubleaxe/daxfb-calculator-core/ui/PreInitApplication';
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
            cssLayer: { name: 'primevue' },
        },
    },
});

app.mount('#root');
