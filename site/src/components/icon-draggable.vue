<script setup lang="ts">
import {ref, unref, reactive} from 'vue';
import type {Item} from '../scripts/data-parsed';
import type ElementDraggable from './element-draggable.vue';

const emit = defineEmits<{
    (e: 'drag-drop', position: {x: number; y: number}, itemName: string): void;
}>();

const draggable = ref<InstanceType<typeof ElementDraggable> | null>(null);
const draggingItem = reactive({
    name: '',
    image: '',
});

const dropItem = (position: {x: number; y: number}) => {
    emit('drag-drop', position, draggingItem.name);
};

const requestDragBegin = (item?: Item) => {
    unref(draggable)?.requestDragBegin(!!item);
    if(item) {
        draggingItem.name = item.name;
        draggingItem.image = item.image;
    }
};

const requestDragForce = () => {
    unref(draggable)?.requestDragForce();
};

defineExpose({
    requestDragBegin,
    requestDragForce,
});
</script>

<template>
    <element-draggable
        ref="draggable"
        :width="32"
        :height="32"
        @drop="dropItem"
    >
        <icon-component :image="draggingItem.image" />
    </element-draggable>
</template>
