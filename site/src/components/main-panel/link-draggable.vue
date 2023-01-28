<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
-->
<script setup lang="ts">
import {unref, computed, reactive, toRaw} from 'vue';
import {
    injectBlueprintModel,
    type BlueprintItemModel,
    type RecipeIOModel,
} from '@/scripts/model/store';
import type {ReadonlyPointType} from '@/scripts/geometry';
import {BlueprintItemState, type BlueprintItemStateValues} from '@/scripts/types';
import {SelectedClassType, useLinkDragAndDrop, usePointAndClick} from '@/composables/drag-helpers';
import {useEventHook} from '@/composables';

const blueprintModel = injectBlueprintModel();
let hoveringItem: BlueprintItemModel | undefined = undefined;

const {hooks, isDragging, currentItem, movableElem} = useLinkDragAndDrop();
const {notifySelected} = usePointAndClick();

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

function clearHoveringItem() {
    if(hoveringItem) {
        hoveringItem.updateLinkState();
        hoveringItem = undefined;
    }
}

function detectItemFromPoint(screenPoint: ReadonlyPointType) {
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
    return item;
}

function processTargetItem(sourceItem: RecipeIOModel, draggingItem: RecipeIOModel, screenPoint: ReadonlyPointType) {
    const item = detectItemFromPoint(screenPoint);
    if(!item) {
        clearHoveringItem();
        return;
    }
    if((toRaw(item) === toRaw(hoveringItem)) || (toRaw(item) === toRaw(sourceItem?.ownerItem))) {
        return;
    }
    clearHoveringItem();
    hoveringItem = item;
    hoveringItem.updateLinkState(sourceItem);
    draggingItem.setFlipped(hoveringItem.isFlipped);
}

function processLink(sourceItem: RecipeIOModel, _hoveringItem: BlueprintItemModel, hoveringState: BlueprintItemStateValues) {
    if(hoveringState === BlueprintItemState.CanLinkTarget) {
        _hoveringItem.createLink(sourceItem);
        return true;
    } else if(hoveringState === BlueprintItemState.CanLinkWithRecipeChange) {
        const recipe = _hoveringItem.possibleRecipeForIo(sourceItem);
        if(recipe) {
            _hoveringItem.selectRecipe(recipe);
            _hoveringItem.createLink(sourceItem);
        }
        return true;
    }
    return false;
}

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
        processLink(sourceItem, hoveringItem, hoveringItem.state);
    }
    clearHoveringItem();
    blueprintModel.clearTempLink();
});

useEventHook(hooks.notifyCancel, () => blueprintModel.clearTempLink());

useEventHook(hooks.notifyMove, (param) => {
    const draggingItem = param.item.dragging;
    if(draggingItem) {
        draggingItem.rect = param.clientRect.positive();
        processTargetItem(param.item.source, draggingItem, param.screenRect);
    }
});

useEventHook(notifySelected, (param) => {
    if(param.item.clazz != SelectedClassType.RecipeIOModel) {
        return;
    }
    const sourceItem = param.item.item as RecipeIOModel;
    const _hoveringItem = detectItemFromPoint(param.screenPosition);
    if(!_hoveringItem || (toRaw(_hoveringItem) === toRaw(sourceItem?.ownerItem))) {
        return;
    }
    const linkState = _hoveringItem.calculateLinkState(sourceItem);
    if(processLink(sourceItem, _hoveringItem, linkState)) {
        param.wasHandled();
    }
});
</script>

<template>
    <manual-transition :animate="isDragging">
        <v-sheet
            ref="movableElem"
            class="rounded dragging-elevation link-draggable hover-background"
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
