import type {Item} from '@/scripts/data/data';
import type {LinkModel, RecipeIOModel} from '@/scripts/model/store';
import {createSharedComposable} from '@vueuse/core';
import {useDragAndDrop} from './drag-n-drop';

export const useLeftPanelDragAndDrop = createSharedComposable(() => useDragAndDrop<Item>({useDelay: true}));

export class LinkDragAndDropItem {
    readonly source: RecipeIOModel;
    link?: LinkModel;
    dragging?: RecipeIOModel;

    constructor(source: RecipeIOModel) {
        this.source = source;
    }
}
export const useLinkDragAndDrop = createSharedComposable(() => useDragAndDrop<LinkDragAndDropItem>({useDelay: true}));
