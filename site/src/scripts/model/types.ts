import type {BlueprintModelImpl} from './blueprint';
import type {BlueprintItemModelImpl} from './blueprint-item';
import type {ItemModelImpl} from './item';
import type {LinkModelImpl} from './link';
import type {RecipeIOModelImpl} from './recipe-io';
import type {RecipeModelImpl} from './recipe';

export type InterfaceOf<T> = Pick<T, keyof T>;
export type BlueprintItemModel = InterfaceOf<BlueprintItemModelImpl>;
export type BlueprintModel = InterfaceOf<BlueprintModelImpl>;
export type ItemModel = InterfaceOf<ItemModelImpl>;
export type LinkModel = InterfaceOf<LinkModelImpl>;
export type RecipeIOModel = InterfaceOf<RecipeIOModelImpl>;
export type RecipeModel = InterfaceOf<RecipeModelImpl>;
