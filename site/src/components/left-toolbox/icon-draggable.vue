<script setup lang="ts">
import {injectSettings} from '@/scripts/settings';
import {ref, unref, reactive} from 'vue';
import type {Item} from '@/scripts/data/data';
import type ElementDraggable from '../element-draggable.vue';
import type {ReadonlyPointType} from '@/scripts/geometry';

const emit = defineEmits<{
    (e: 'drag-drop', position: ReadonlyPointType, itemName: string): void;
}>();

const settings = injectSettings();
const draggableElement = ref<InstanceType<typeof ElementDraggable> | null>(null);
const draggingItem = reactive({
    name: '',
    image: '',
});

const dropItem = (position: ReadonlyPointType) => {
    emit('drag-drop', position, draggingItem.name);
};

const requestDragBegin = (item?: Item) => {
    unref(draggableElement)?.requestDragBegin(!!item);
    if(item) {
        draggingItem.name = item.name;
        draggingItem.image = item.image;
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
        immediate @drop="dropItem"
    >
        <v-sheet class="rounded dragging-elevation">
            <icon-component :image="draggingItem.image" />
        </v-sheet>
    </element-draggable>
</template>
