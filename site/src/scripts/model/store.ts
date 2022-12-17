import {BlueprintModelImpl} from './blueprint';
import type {BlueprintItemModelImpl} from './blueprint-item';
import type {ItemModelImpl} from './item';
import type {LinkModelImpl} from './link';
import type {RecipeIOModelImpl} from './recipe-io';
import type {RecipeModelImpl} from './recipe';
import type {InjectionKey, App} from 'vue';
import {reactive, inject} from 'vue';
import type {ReadonlyPointType} from '../geometry';
import type {InterfaceOf} from '../types';

export type UpdateOffsetPositionCallback = () => ReadonlyPointType | undefined;
export type ScreenToClientOptions = {isPassive?: boolean};
export type ScreenToClientProvider = {
    screenToClient(point: ReadonlyPointType, {isPassive}: ScreenToClientOptions): ReadonlyPointType;
};

export type BlueprintItemModel = InterfaceOf<BlueprintItemModelImpl>;
export type BlueprintModel = InterfaceOf<BlueprintModelImpl>;
export type ItemModel = InterfaceOf<ItemModelImpl>;
export type LinkModel = InterfaceOf<LinkModelImpl>;
export type RecipeIOModel = InterfaceOf<RecipeIOModelImpl>;
export type RecipeModel = InterfaceOf<RecipeModelImpl>;

export const BlueprintItemState = {
    None: 'bg-grey-lighten-4',
    CannotLinkTarget: 'bg-error',
    LinkTarget: 'bg-success',
} as const;
type BlueprintItemStateKeys = keyof typeof BlueprintItemState;
export type BlueprintItemStateValues = typeof BlueprintItemState[BlueprintItemStateKeys];

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
