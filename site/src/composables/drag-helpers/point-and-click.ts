import type {Item} from '@/scripts/data/data';
import {Point, Rect} from '@/scripts/geometry';
import type {BlueprintItemModel, RecipeIOModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {createEventHook, createSharedComposable, type MaybeElement} from '@vueuse/core';
import {readonly, ref, toRaw, unref, watch} from 'vue';
import {justEventHook} from '..';
import {screenToClient} from './commons';

export const SelectedClassType = {
    Item: 'A',
    BlueprintItemModel: 'B',
    RecipeIOModel: 'C',
} as const;
export type SelectedClassTypeKeys = keyof typeof SelectedClassType;
export type SelectedClassTypeValues = typeof SelectedClassType[SelectedClassTypeKeys];

export type SelectedItemType = Item | BlueprintItemModel | RecipeIOModel | undefined;

export class SelectedItem {
    public readonly clazz;
    public readonly item;
    constructor(clazz: SelectedClassTypeValues, item: SelectedItemType) {
        this.clazz = clazz;
        this.item = item;
        Object.freeze(this);
    }
    isSelected(item: SelectedItemType) {
        return toRaw(item) === toRaw(this.item);
    }
}

export interface PoinAndClickListenerParam {
    item: SelectedItem;
    screenPosition: Point;
    clientPosition: Point;
    wasHandled: () => void;
}

export const usePointAndClick = createSharedComposable(() => {
    const settings = injectSettings();
    const selectedItem = ref<SelectedItem | undefined>();
    const notifySelected = createEventHook<PoinAndClickListenerParam>();
    const parentElem = ref<MaybeElement>();

    function selectItem(clazz: SelectedClassTypeValues, item: SelectedItemType) {
        if(!settings.pointAndClickEnabled) {
            return;
        }
        if(unref(selectedItem)?.isSelected(item)) {
            //second click unselects
            selectedItem.value = undefined;
        } else {
            selectedItem.value = new SelectedItem(clazz, item);
        }
    }
    function processSelected(event: MouseEvent) {
        const _selectedItem = unref(selectedItem);
        if(_selectedItem) {
            const screenPosition = Point.assign({x: event.clientX, y: event.clientY});
            const clientPosition = Point.assign(screenToClient(parentElem, Rect.assign(screenPosition), settings.scale));

            let wasHandled = false;
            const param: PoinAndClickListenerParam = {
                item: _selectedItem,
                screenPosition,
                clientPosition,
                wasHandled: () => {
                    wasHandled = true;
                },
            };
            Object.freeze(param);

            notifySelected.trigger(param);

            if(wasHandled) {
                selectedItem.value = undefined;
            }
        }
    }

    watch(() => settings.pointAndClickEnabled, (value) => {
        if(!value) {
            selectedItem.value = undefined;
        }
    });

    return {
        selectedItem: readonly(selectedItem),
        notifySelected: justEventHook(notifySelected),
        selectItem,
        processSelected,
        parentElem,
    };
});
