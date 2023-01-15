import {BlueprintModelImpl} from './blueprint';
import type {BlueprintItemModelImpl} from './blueprint-item';
import type {ItemModelImpl} from './item';
import type {LinkModelImpl} from './link';
import type {LinkShapeModelImpl} from './link-shape';
import type {RecipeIOModelImpl} from './recipe-io';
import type {RecipeModelImpl} from './recipe';
import type {InjectionKey, App} from 'vue';
import {reactive, inject} from 'vue';
import type {Point, ReadonlyPointType, Rect} from '../geometry';
import type {InterfaceOf} from '../types';

export type UpdateOffsetPositionCallback = () => ReadonlyPointType | undefined;
export type ScreenToClientOptions = {isPassive?: boolean};
export type ScreenToClientProvider = {
    screenToClient(point: ReadonlyPointType, {isPassive}: ScreenToClientOptions): ReadonlyPointType;
};

export type PublicPoint = InterfaceOf<Point>;
export type PublicRect = InterfaceOf<Rect>;
export type BlueprintItemModel = InterfaceOf<BlueprintItemModelImpl>;
export type BlueprintModel = InterfaceOf<BlueprintModelImpl>;
export type ItemModel = InterfaceOf<ItemModelImpl>;
export type LinkModel = InterfaceOf<LinkModelImpl>;
export type LinkShapeModel = InterfaceOf<LinkShapeModelImpl>;
export type RecipeIOModel = InterfaceOf<RecipeIOModelImpl>;
export type RecipeModel = InterfaceOf<RecipeModelImpl>;

export const BlueprintModelKey = Symbol('BlueprintModel') as InjectionKey<BlueprintModel>;
export const provideBlueprintModel = (app: App) => {
    app.provide(BlueprintModelKey, reactive(new BlueprintModelImpl()));
};
export const injectBlueprintModel = () => {
    const blueprint = inject(BlueprintModelKey);
    if(!blueprint)
        throw new Error('blueprint not instantiated');
    return blueprint;
};
