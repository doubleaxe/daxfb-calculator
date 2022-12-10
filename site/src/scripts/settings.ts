import {type InjectionKey, type App, reactive, inject} from 'vue';

class Settings {
    iconSize = 32;
    hoveringElevation = 5;
    draggingElevation = 10;
}

export const SettingsKey = Symbol('Settings') as InjectionKey<Settings>;
export const provideSettings = (app: App) => {
    app.provide(SettingsKey, reactive(new Settings()));
};
export const injectSettings = () => {
    const settings = inject(SettingsKey);
    if(!settings)
        throw new Error('settings not instantiated');
    return settings;
};
