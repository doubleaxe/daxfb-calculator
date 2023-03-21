/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {BlueprintModelImpl} from './blueprint';
import type {BlueprintItemModelImpl} from './blueprint-item';
import type {ItemModelImpl} from './item';
import type {LinkModelImpl} from './link';
import type {RecipeIOModelImpl} from './recipe-io';
import type {RecipeModelImpl} from './recipe';
import type {LogisticModelImpl, LogisticSetModelImpl, TransportModelImpl} from './logistic';
import type {InjectionKey} from 'vue';
import {reactive, inject, provide} from 'vue';
import type {InterfaceOf} from '../types';
import type {GameData} from '../data';

export type BlueprintItemModel = InterfaceOf<BlueprintItemModelImpl>;
export type BlueprintModel = InterfaceOf<BlueprintModelImpl>;
export type ItemModel = InterfaceOf<ItemModelImpl>;
export type LinkModel = InterfaceOf<LinkModelImpl>;
export type RecipeIOModel = InterfaceOf<RecipeIOModelImpl>;
export type RecipeModel = InterfaceOf<RecipeModelImpl>;
export type TransportModel = InterfaceOf<TransportModelImpl>;
export type LogisticModel = InterfaceOf<LogisticModelImpl>;
export type LogisticSetModel = InterfaceOf<LogisticSetModelImpl>;

export const BlueprintModelKey = Symbol('BlueprintModel') as InjectionKey<BlueprintModel>;
export const provideBlueprintModel = (_gameData: GameData): BlueprintModel => {
    const blueprint = reactive(new BlueprintModelImpl(_gameData));
    provide(BlueprintModelKey, blueprint);
    return blueprint;
};
export const injectBlueprintModel = () => {
    const blueprint = inject(BlueprintModelKey);
    if(!blueprint)
        throw new Error('blueprint not instantiated');
    return blueprint;
};

export * from './normalize-item-positions';
