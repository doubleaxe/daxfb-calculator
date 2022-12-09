<script setup lang="ts">
import {ref, unref, reactive} from 'vue';
import {injectBlueprintModel, type ItemModel, type LinkModel, type RecipeIOModel} from '../../scripts/model/store';
import type ElementDraggable from '../element-draggable.vue';

const emit = defineEmits<{
    (e: 'drag-drop', position: {x: number; y: number}, itemName: string): void;
}>();

const blueprintModel = injectBlueprintModel();
const draggableElement = ref<InstanceType<typeof ElementDraggable> | null>(null);
const draggingSource = ref<RecipeIOModel | null>(null);
let draggingTarget: RecipeIOModel | undefined = undefined;
let draggingLink: LinkModel | undefined = undefined;
const deltaXY = {x: 0, y: 0};

const dropItem = (position: {x: number; y: number}) => {
    blueprintModel.clearTempLinks();
};

const requestDragBegin = (item?: RecipeIOModel) => {
    unref(draggableElement)?.requestDragBegin(!!item);
    if(item) {
        draggingSource.value = item;
    }
};

const dragShown = (screenXY: {x: number; y: number}) => {
    const thisNode = unref(draggableElement)?.$el as HTMLElement | undefined;
    const parentElement = thisNode?.parentElement;
    const _draggingSource = unref(draggingSource);
    if(parentElement && _draggingSource) {
        const clientXY = blueprintModel.screenToClient(screenXY);
        deltaXY.x = clientXY.x - screenXY.x;
        deltaXY.y = clientXY.y - screenXY.y;
        draggingTarget = _draggingSource.tempClone(true);
        draggingTarget.pos.x = clientXY.x;
        draggingTarget.pos.y = clientXY.y;
        draggingLink = blueprintModel.createTempLink(_draggingSource, draggingTarget);
    }
};

const dragMove = (screenXY: {x: number; y: number}) => {
    if(draggingTarget) {
        draggingTarget.pos.x = screenXY.x + deltaXY.x;
        draggingTarget.pos.y = screenXY.y + deltaXY.y;
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
        :width="32"
        :height="32"
        @drag-shown="dragShown"
        @drag-move="dragMove"
        @drop="dropItem"
    >
        <v-sheet class="rounded elevation-10">
            <icon-component :image="draggingSource?.image || ''" />
        </v-sheet>
    </element-draggable>
</template>
