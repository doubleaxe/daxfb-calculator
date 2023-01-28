import {useLocalStorage} from '@vueuse/core';
import {type InjectionKey, type App, reactive, inject, watch, unref} from 'vue';
import type {PublicFilter} from './filter';
import type {BlueprintModel} from './model/store';
import {BlueprintItemState, type BlueprintItemStateValues} from './types';

type BlueprintItemStateColorClass = Record<BlueprintItemStateValues, string>;

type PossibleKeys = Array<keyof Settings>;
const SavedKeys: PossibleKeys = [
    'colorfulLinks',
    'tier',
    'tierEqual',
    'groupTier',
    'autoSolveGraph',
    'solvePrecision',
];
type SavedObject = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
};

function filterSavedKeys(object: SavedObject) {
    const savedObject = SavedKeys.reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
    }, {} as SavedObject);
    return savedObject;
}

class Settings {
    private _filter: PublicFilter;
    private _blueprintModel: BlueprintModel;

    constructor(blueprintModel: BlueprintModel, filter: PublicFilter) {
        this._blueprintModel = blueprintModel;
        this._filter = filter;
    }

    iconSize = 32;
    itemStateColor: BlueprintItemStateColorClass = {
        [BlueprintItemState.None]: 'bg-window-idle',
        [BlueprintItemState.CannotLinkTarget]: 'bg-error',
        [BlueprintItemState.CanLinkTarget]: 'bg-success',
        [BlueprintItemState.LinkAlreadyExists]: 'bg-warning',
        [BlueprintItemState.CanLinkWithRecipeChange]: 'bg-info',
    };
    scale = 1;
    colorfulLinks = true;
    dragAndDropEnabled = true;
    dragAndScrollEnabled = true;
    overflowScrollEnabled = true;
    pointAndClickEnabled = true;

    get tier() { return this._filter.tier; }
    set tier(tier: number | undefined) { this._filter.tier = tier; }
    get tierEqual() { return this._filter.tierEqual; }
    set tierEqual(tierEqual: number) { this._filter.tierEqual = tierEqual; }
    get groupTier() { return this._filter.groupTier; }
    set groupTier(groupTier: boolean) { this._filter.groupTier = groupTier; }
    get autoSolveGraph() { return this._blueprintModel.autoSolveGraph; }
    set autoSolveGraph(autoSolveGraph: boolean) { this._blueprintModel.autoSolveGraph = autoSolveGraph; }
    get solvePrecision() { return this._blueprintModel.solvePrecision; }
    set solvePrecision(solvePrecision: number) { this._blueprintModel.solvePrecision = solvePrecision; }

    save() {
        return filterSavedKeys(this);
    }
    load(settings: SavedObject) {
        Object.assign(this, filterSavedKeys(settings));
    }
}

export const SettingsKey = Symbol('Settings') as InjectionKey<Settings>;
export const provideSettings = (app: App, blueprintModel: BlueprintModel, filter: PublicFilter) => {
    const settings = reactive(new Settings(blueprintModel, filter));
    app.provide(SettingsKey, settings);
    const savedSettings = useLocalStorage<SavedObject>('settings', settings.save(), {
        mergeDefaults: true,
    });
    settings.load(unref(savedSettings));
    watch(settings, () => Object.assign(savedSettings.value, settings.save()));
    watch(savedSettings, () => settings.load(unref(savedSettings)));
};
export const injectSettings = () => {
    const settings = inject(SettingsKey);
    if(!settings)
        throw new Error('settings not instantiated');
    return settings;
};
