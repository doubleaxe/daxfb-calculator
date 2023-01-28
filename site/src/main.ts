/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
*/
import {createApp} from 'vue';
import {createVuetify} from 'vuetify';
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg';
import App from './app.vue';
import {provideBlueprintModel} from './scripts/model/store';
import {provideSettings} from './scripts/settings';
import {provideFilter} from './scripts/filter';

import './assets/vuetify.scss';
import './assets/main.scss';

const __GAME__ = import.meta.env.VITE_GAME;
if(__GAME__) {
    document.title = `${__GAME__.charAt(0).toUpperCase() + __GAME__.slice(1)} Calculator/Factory Builder by Alexey Usov`;
}

const app = createApp(App);

const blueprint = provideBlueprintModel(app);
const filter = provideFilter(app);
provideSettings(app, blueprint, filter);
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
