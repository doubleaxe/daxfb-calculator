import {createApp} from 'vue';
import {createVuetify} from 'vuetify';
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg';
import App from './app.vue';
import {provideBlueprintModel} from './scripts/model/store';
import {provideSettings} from './scripts/settings';

import 'vuetify/styles';
import './assets/main.css';

const app = createApp(App);

provideBlueprintModel(app);
provideSettings(app);
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
