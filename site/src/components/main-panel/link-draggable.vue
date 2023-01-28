<script setup lang="ts">
import {unref, computed, reactive} from 'vue';
import {
    injectBlueprintModel,
    type BlueprintItemModel,
    type RecipeIOModel,
} from '@/scripts/model/store';
import type {ReadonlyPointType} from '@/scripts/geometry';
import {BlueprintItemState} from '@/scripts/types';
import {useLinkDragAndDrop} from '@/composables/drag-helpers';
import {useEventHook} from '@/composables';

const blueprintModel = injectBlueprintModel();
let hoveringItem: BlueprintItemModel | undefined = undefined;

const {hooks, isDragging, currentItem, movableElem} = useLinkDragAndDrop();

const draggableStyle = computed(() => {
    const _isDragging = unref(isDragging);
    const _dragRect = unref(currentItem)?.dragging?.rect;
    //keep far offscreen, so drag-n-drop processor could get width and height
    if(!_isDragging || !_dragRect) {
        return {left: '-10000px', top: '-10000px'};
    }
    return {
        left: `${_dragRect.x}px`,
        top: `${_dragRect.y}px`,
    };
});

const clearHoveringItem = () => {
    if(hoveringItem) {
        hoveringItem.calculateLinkState();
        hoveringItem = undefined;
    }
};

const processTargetItem = (sourceItem: RecipeIOModel, draggingItem: RecipeIOModel, screenPoint: ReadonlyPointType) => {
    const elements = document.elementsFromPoint(screenPoint.x, screenPoint.y);
    let item: BlueprintItemModel | undefined;
    elements.find((element) => {
        const itemId = element.getAttribute('data-item-id');
        if(itemId) {
            item = blueprintModel.itemByKey(itemId);
            if(item)
                return true;
        }
        return false;
    });
    if(!item) {
        clearHoveringItem();
        return;
    }
    if((item === hoveringItem) || (item === sourceItem?.ownerItem)) {
        return;
    }
    clearHoveringItem();
    hoveringItem = item;
    hoveringItem.calculateLinkState(sourceItem);
    draggingItem.setFlipped(hoveringItem.isFlipped);
};

useEventHook(hooks.notifyStart, (param) => {
    const item = param.item;
    const {link, target} = reactive(item.source.createTempLink());
    target.setFlipped(item.source.isFlipped);
    item.link = link;
    item.dragging = target;
});

useEventHook(hooks.notifyDrop, (param) => {
    const sourceItem = param.item.source;
    if(sourceItem && hoveringItem) {
        if(hoveringItem.state === BlueprintItemState.CanLinkTarget) {
            hoveringItem.createLink(sourceItem);
        } else if(hoveringItem.state === BlueprintItemState.CanLinkWithRecipeChange) {
            const recipe = hoveringItem.possibleRecipeForIo(sourceItem);
            if(recipe) {
                hoveringItem.selectRecipe(recipe);
                hoveringItem.createLink(sourceItem);
            }
        }
    }
    clearHoveringItem();
    blueprintModel.clearTempLinks();
});

useEventHook(hooks.notifyCancel, () => blueprintModel.clearTempLinks());

useEventHook(hooks.notifyMove, (param) => {
    const draggingItem = param.item.dragging;
    if(draggingItem) {
        draggingItem.rect = param.clientRect.positive();
        processTargetItem(param.item.source, draggingItem, param.screenRect);
    }
});
</script>

<template>
    <manual-transition :animate="isDragging">
        <v-sheet
            ref="movableElem"
            class="rounded dragging-elevation bg-window-idle link-draggable"
            :style="draggableStyle"
        >
            <icon-component :image="currentItem?.source?.image || ''" />
        </v-sheet>
    </manual-transition>
</template>

<style scoped>
.link-draggable {
    position: absolute;
    z-index: 5000;
}
</style>
