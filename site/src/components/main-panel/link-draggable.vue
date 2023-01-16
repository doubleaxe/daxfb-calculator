<script setup lang="ts">
import {injectSettings} from '@/scripts/settings';
import {ref, unref, reactive} from 'vue';
import {
    injectBlueprintModel,
    type BlueprintItemModel,
    type RecipeIOModel,
} from '@/scripts/model/store';
import type ElementDraggable from '../element-draggable.vue';
import type {ReadonlyPointType} from '@/scripts/geometry';
import {BlueprintItemState} from '@/scripts/types';

const settings = injectSettings();
const blueprintModel = injectBlueprintModel();
const draggableElement = ref<InstanceType<typeof ElementDraggable> | null>(null);
const draggingSource = ref<RecipeIOModel | null>(null);
let draggingTarget: RecipeIOModel | undefined = undefined;
let hoveringItem: BlueprintItemModel | undefined = undefined;

const clearHoveringItem = () => {
    if(hoveringItem) {
        hoveringItem.calculateLinkState();
        hoveringItem = undefined;
    }
};

const dropItem = () => {
    const _draggingSource = unref(draggingSource);
    if(_draggingSource && hoveringItem) {
        if(hoveringItem.state === BlueprintItemState.CanLinkTarget) {
            hoveringItem.createLink(_draggingSource);
        }
    }
    clearHoveringItem();
    blueprintModel.clearTempLinks();
};

const requestDragBegin = (item?: RecipeIOModel) => {
    unref(draggableElement)?.requestDragBegin(!!item);
    if(item) {
        draggingSource.value = item;
    }
};

const dragShown = (screenXY: ReadonlyPointType) => {
    const _draggingSource = unref(draggingSource);
    if(!_draggingSource)
        return;
    const clientXY = blueprintModel.screenToClient(screenXY);
    draggingTarget = reactive(_draggingSource.createTempLink());
    draggingTarget.rect = draggingTarget.rect.assign({
        x: clientXY.x,
        y: clientXY.y,
        width: settings.iconSize,
        height: settings.iconSize,
    });
};

const updateLink = (screenXY: ReadonlyPointType) => {
    if(!draggingTarget)
        return false;
    const clientXY = blueprintModel.screenToClient(screenXY, {isPassive: true});
    draggingTarget.rect = draggingTarget.rect.assignPoint(clientXY);
    return true;
};

const processTargetItem = (screenXY: ReadonlyPointType) => {
    const elements = document.elementsFromPoint(screenXY.x, screenXY.y);
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
    const _draggingSource = unref(draggingSource);
    if((item === hoveringItem) || (item === _draggingSource?.ownerItem)) {
        return;
    }
    clearHoveringItem();
    hoveringItem = item;
    hoveringItem.calculateLinkState(_draggingSource);
};

const dragMove = (screenXY: ReadonlyPointType) => {
    if(!updateLink(screenXY))
        return;
    processTargetItem(screenXY);
};

const requestDragForce = () => {
    unref(draggableElement)?.requestDragForce();
};

defineExpose({
    requestDragBegin,
    requestDragForce,
});
</script>

<template>
    <element-draggable
        ref="draggableElement"
        :width="settings.iconSize"
        :height="settings.iconSize"
        immediate
        @drag-shown="dragShown"
        @drag-move="dragMove"
        @drop="dropItem"
    >
        <v-sheet class="rounded dragging-elevation bg-window-idle">
            <icon-component :image="draggingSource?.image || ''" />
        </v-sheet>
    </element-draggable>
</template>
