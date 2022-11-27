<script setup lang="ts">
import {ref, reactive} from 'vue';
import {itemCollection} from '../scripts/factory';

const emit = defineEmits<{
    (e: 'drop', itemName: string, position: {x: number, y: number}): void
}>();

const producerItems = itemCollection.getProducerItems();
const _beginDragging = ref(false);
const draggingItem = reactive({
    name: '',
    image: '',
});

const beginDragging = (item: typeof producerItems[0]) => {
    _beginDragging.value = true;
    draggingItem.name = item.name;
    draggingItem.image = item.image;
};
const dropItem = (position: {x: number, y: number}) => {
    _beginDragging.value = false;
    emit('drop', draggingItem.name, position);
};
</script>

<template>
    <element-draggable
        :activating="_beginDragging"
        :width="32"
        :height="32"
        @drop="dropItem"
    >
        <icon-component :image="draggingItem.image" />
    </element-draggable>
    <icon-component
        v-for="item in producerItems"
        :key="item.name"
        :image="item.image"
        @mousedown="beginDragging(item)"
        @mouseup="_beginDragging = false"
    />
</template>

<style scoped>
</style>
