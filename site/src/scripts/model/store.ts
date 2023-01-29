/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {BlueprintModelImpl} from './blueprint';
import type {BlueprintItemModelImpl} from './blueprint-item';
import type {ItemModelImpl} from './item';
import type {LinkModelImpl} from './link';
import type {RecipeIOModelImpl} from './recipe-io';
import type {RecipeModelImpl} from './recipe';
import type {InjectionKey, App} from 'vue';
import {reactive, inject} from 'vue';
import type {Point, Rect} from '../geometry';
import type {InterfaceOf} from '../types';

export type PublicPoint = InterfaceOf<Point>;
export type PublicRect = InterfaceOf<Rect>;
export type BlueprintItemModel = InterfaceOf<BlueprintItemModelImpl>;
export type BlueprintModel = InterfaceOf<BlueprintModelImpl>;
export type ItemModel = InterfaceOf<ItemModelImpl>;
export type LinkModel = InterfaceOf<LinkModelImpl>;
export type RecipeIOModel = InterfaceOf<RecipeIOModelImpl>;
export type RecipeModel = InterfaceOf<RecipeModelImpl>;

export const BlueprintModelKey = Symbol('BlueprintModel') as InjectionKey<BlueprintModel>;
export const provideBlueprintModel = (app: App): BlueprintModel => {
    const blueprint = reactive(new BlueprintModelImpl());
    app.provide(BlueprintModelKey, blueprint);
    return blueprint;
};
export const injectBlueprintModel = () => {
    const blueprint = inject(BlueprintModelKey);
    if(!blueprint)
        throw new Error('blueprint not instantiated');
    return blueprint;
};
