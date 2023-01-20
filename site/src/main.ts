import {createApp} from 'vue';
import {createVuetify} from 'vuetify';
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg';
import App from './app.vue';
import {provideBlueprintModel} from './scripts/model/store';
import {provideSettings} from './scripts/settings';
import {provideFilter} from './scripts/filter';

import './assets/vuetify.scss';
import './assets/main.scss';

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
