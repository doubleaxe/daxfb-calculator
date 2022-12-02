import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {createVuetify} from 'vuetify';
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg';
import App from './app.vue';

import 'vuetify/styles';
import './assets/main.css';

const app = createApp(App);

app.use(createPinia()).use(createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
}));

app.mount('#app');
