<script setup lang="ts">
import {injectSettings} from '@/scripts/settings';
import {ref, unref, reactive} from 'vue';
import {injectBlueprintModel, type ItemModel, type LinkModel, type RecipeIOModel} from '@/scripts/model/store';
import type ElementDraggable from '../element-draggable.vue';
import {Point, type ReadonlyPointType} from '@/scripts/geometry';

const emit = defineEmits<{
    (e: 'drag-drop', position: ReadonlyPointType, itemName: string): void;
}>();

const settings = injectSettings();
const blueprintModel = injectBlueprintModel();
const draggableElement = ref<InstanceType<typeof ElementDraggable> | null>(null);
const draggingSource = ref<RecipeIOModel | null>(null);
let draggingTarget: RecipeIOModel | undefined = undefined;
let draggingLink: LinkModel | undefined = undefined;
const deltaXY = new Point();

const dropItem = (position: ReadonlyPointType) => {
    blueprintModel.clearTempLinks();
};

const requestDragBegin = (item?: RecipeIOModel) => {
    unref(draggableElement)?.requestDragBegin(!!item);
    if(item) {
        draggingSource.value = item;
    }
};

const dragShown = (screenXY: ReadonlyPointType) => {
    const thisNode = unref(draggableElement)?.$el as HTMLElement | undefined;
    const parentElement = thisNode?.parentElement;
    const _draggingSource = unref(draggingSource);
    if(parentElement && _draggingSource) {
        const clientXY = blueprintModel.screenToClient(screenXY);
        deltaXY.assignPoint(clientXY).offsetBy(screenXY, -1);
        draggingTarget = _draggingSource.tempClone(true);
        draggingTarget.rect.assignPoint(clientXY);
        draggingLink = blueprintModel.createTempLink(_draggingSource, draggingTarget);
    }
};

const dragMove = (screenXY: {x: number; y: number}) => {
    if(draggingTarget) {
        draggingTarget.rect.x = screenXY.x + deltaXY.x;
        draggingTarget.rect.y = screenXY.y + deltaXY.y;
    }
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
        @drag-shown="dragShown"
        @drag-move="dragMove"
        @drop="dropItem"
    >
        <v-sheet :class="['rounded', 'elevation-' + settings.draggingElevation]">
            <icon-component :image="draggingSource?.image || ''" />
        </v-sheet>
    </element-draggable>
</template>
