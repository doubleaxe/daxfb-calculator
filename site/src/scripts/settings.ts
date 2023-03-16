/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {useLocalStorage} from '@vueuse/core';
import {type InjectionKey, provide, reactive, inject, watch, unref} from 'vue';
import type {GameData} from './data';
import type {PublicFilter} from './filter';
import type {BlueprintModel} from './model/store';
import {BlueprintItemState, DEFAULT_BLUEPRINT_SPLIT, type BlueprintItemStateValues} from './types';

type BlueprintItemStateColorClass = Record<BlueprintItemStateValues, string>;

type PossibleKeys = Array<keyof Settings>;
const SavedKeys: PossibleKeys = [
    'colorfulLinks',
    'tier',
    'tierEqual',
    'groupTier',
    'autoSolveGraph',
    'solvePrecision',
    'scale',
    'colorfulLinks',
    'dragAndDropEnabled',
    'dragAndScrollEnabled',
    'overflowScrollEnabled',
    'pointAndClickEnabled',
    'blueprintCompress',
    'blueprintEncode',
    'blueprintSplit',
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

function isTouchDevice() {
    try {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0));
    } catch(err) {
        return false;
    }
}

class Settings {
    private _filter: PublicFilter;
    private _blueprintModel: BlueprintModel;
    private _isTouchDevice;

    constructor(blueprintModel: BlueprintModel, filter: PublicFilter) {
        this._blueprintModel = blueprintModel;
        this._filter = filter;

        const touchDevice = isTouchDevice();
        this.dragAndDropEnabled = !touchDevice;
        this.dragAndScrollEnabled = !touchDevice;
        this.overflowScrollEnabled = !touchDevice;
        this.pointAndClickEnabled = touchDevice;
        this._isTouchDevice = touchDevice;
    }

    get isTouchDevice() { return this._isTouchDevice; }

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
    dragAndDropEnabled;
    dragAndScrollEnabled;
    overflowScrollEnabled;
    pointAndClickEnabled;

    blueprintCompress = true;
    blueprintEncode = true;
    blueprintSplit = DEFAULT_BLUEPRINT_SPLIT;

    get tier() { return this._filter.tier; }
    set tier(tier: number | null | undefined) { this._filter.tier = tier ?? undefined; }
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
export const provideSettings = (gameData: GameData, blueprintModel: BlueprintModel, filter: PublicFilter) => {
    const settings = reactive(new Settings(blueprintModel, filter));
    const name = gameData.gameDescription.name;
    provide(SettingsKey, settings);
    const savedSettings = useLocalStorage<SavedObject>(`settings-${name}`, settings.save(), {
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
