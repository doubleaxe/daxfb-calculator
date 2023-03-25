/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import {createApp} from 'vue';
import {createVuetify} from 'vuetify';
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg';
import App from './app.vue';

import './assets/vuetify.scss';
import './assets/main.scss';

const app = createApp(App);

app.use(createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
}));

app.mount('#app');
