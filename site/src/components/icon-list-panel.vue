<script setup lang="ts">
import {ref} from 'vue';
import {itemCollection} from '../scripts/factory';

const producerItems = itemCollection.getProducerItems();
const tryDragging = ref(false);

</script>

<template>
    <producer-draggable :activating="tryDragging" />
    <icon-component
        v-for="item in producerItems"
        :key="item.name"
        :image="item.image"
        @mousedown="tryDragging = true"
        @mouseup="tryDragging = false"
    />
</template>

<style scoped>
</style>
