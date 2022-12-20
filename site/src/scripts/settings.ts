import {type InjectionKey, type App, reactive, inject} from 'vue';
import {BlueprintItemState, type BlueprintItemStateValues} from './types';

type BlueprintItemStateColorClass = Record<BlueprintItemStateValues, string>;
class Settings {
    iconSize = 32;
    hoveringElevation = 5;
    draggingElevation = 10;
    itemStateColor: BlueprintItemStateColorClass = {
        [BlueprintItemState.None]: 'bg-grey-lighten-4',
        [BlueprintItemState.CannotLinkTarget]: 'bg-error',
        [BlueprintItemState.CanLinkTarget]: 'bg-success',
        [BlueprintItemState.LinkAlreadyExists]: 'bg-warning',
    };
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
