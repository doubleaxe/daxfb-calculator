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
import type {InjectionKey} from 'vue';
import {reactive, inject, provide} from 'vue';
import type {Point, Rect} from '../geometry';
import type {InterfaceOf} from '../types';
import type {GameData} from '../data';

export type PublicPoint = InterfaceOf<Point>;
export type PublicRect = InterfaceOf<Rect>;
export type BlueprintItemModel = InterfaceOf<BlueprintItemModelImpl>;
export type BlueprintModel = InterfaceOf<BlueprintModelImpl>;
export type ItemModel = InterfaceOf<ItemModelImpl>;
export type LinkModel = InterfaceOf<LinkModelImpl>;
export type RecipeIOModel = InterfaceOf<RecipeIOModelImpl>;
export type RecipeModel = InterfaceOf<RecipeModelImpl>;

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
