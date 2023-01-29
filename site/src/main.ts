/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {createApp} from 'vue';
import {createVuetify} from 'vuetify';
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg';
import App from './app.vue';
import {provideBlueprintModel} from './scripts/model/store';
import {provideSettings} from './scripts/settings';
import {provideFilter} from './scripts/filter';
import {dataProvider} from './scripts/data/data';

import './assets/vuetify.scss';
import './assets/main.scss';

const description = dataProvider.getDescription();
document.title = `${description.Description} Calculator/Factory Builder by Alexey Usov`;

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
