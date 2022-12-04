import {defineStore} from 'pinia';
import {reactive} from 'vue';
import {BlueprintModel} from './blueprint';

export const useBlueprintModel = defineStore('blueprint', () => {
    const blueprint = reactive(new BlueprintModel());
    return {blueprint};
});

export * from './blueprint';
export * from './blueprint-item';
export * from './item';
export * from './recipe';
