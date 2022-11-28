<script setup lang="ts">
import {ref, unref, reactive} from 'vue';
import type {ProducerFactory} from '../scripts/factory';
import type ElementDraggable from './element-draggable.vue';

const emit = defineEmits<{
    (e: 'drag-drop', itemName: string, position: {x: number, y: number}): void
}>();

const draggable = ref<InstanceType<typeof ElementDraggable> | null>(null);
const draggingItem = reactive({
    name: '',
    image: '',
});

const dropItem = (position: {x: number, y: number}) => {
    emit('drag-drop', draggingItem.name, position);
};

const requestDragBegin = (item?: ProducerFactory) => {console.log('begin');
    unref(draggable)?.requestDragBegin(!!item);
    if(item) {
        draggingItem.name = item.name;
        draggingItem.image = item.image;
    }
};

const requestDragForce = () => {console.log('force');
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

<style scoped>
</style>
