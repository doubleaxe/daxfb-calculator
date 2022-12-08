import {defineStore} from 'pinia';
import {reactive} from 'vue';
import {BlueprintModelImpl} from './blueprint';
import type {BlueprintModel} from './types';

export const useBlueprintModel = defineStore('blueprint', () => {
    //types are compatible, just don't use instanceof
    //ReactiveBlueprintModel is too complex to handle
    const blueprint: BlueprintModel = reactive(new BlueprintModelImpl());
    return {blueprint};
});

export type {
    BlueprintItemModel,
    BlueprintModel,
    ItemModel,
    LinkModel,
    RecipeIOModel,
    RecipeModel,
} from './types';
