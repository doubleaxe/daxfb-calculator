<script setup lang="ts">
import {itemCollection} from '../scripts/factory';

const emit = defineEmits<{
    (e: 'drag-begin', item?: typeof producerItems[0]): void,
    (e: 'drag-force'): void,
}>();

const producerItems = itemCollection.getProducerItems();
</script>

<template>
    <icon-component
        v-for="item in producerItems"
        :key="item.name"
        :image="item.image"
        class="icon-div"
        @pointerdown="emit('drag-begin', item)"
        @pointerup="emit('drag-begin')"
    />
</template>

<style scoped>
.icon-div {
    display: inline-block;
}
</style>
