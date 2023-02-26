/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameItem} from '#types/game-data';
import type {BlueprintItemModel, LinkModel, RecipeIOModel} from '@/scripts/model/store';
import {createSharedComposable} from '@vueuse/core';
import {useDragAndDrop} from './drag-and-drop';

export const useLeftPanelDragAndDrop = createSharedComposable(() => useDragAndDrop<GameItem>({useDelay: true}));

export class LinkDragAndDropItem {
    readonly source: RecipeIOModel;
    link?: LinkModel;
    dragging?: RecipeIOModel;

    constructor(source: RecipeIOModel) {
        this.source = source;
    }
}
export const useLinkDragAndDrop = createSharedComposable(() => useDragAndDrop<LinkDragAndDropItem>({useDelay: true}));

export const useItemDragAndDrop = createSharedComposable(() => useDragAndDrop<BlueprintItemModel>());
