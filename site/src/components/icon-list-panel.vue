<script setup lang="ts">
import {itemCollection} from '../scripts/data-parsed';

const emit = defineEmits<{
    (e: 'drag-begin', item?: typeof producerItems[0]): void;
    (e: 'drag-force'): void;
}>();

const producerItems = itemCollection.getProducerItems();
</script>

<template>
    <div v-for="item in producerItems" :key="item.name" class="icon-div">
        <v-hover v-slot="{isHovering, props}">
            <icon-component
                v-bind="props"
                :class="`elevation-${isHovering ? 5 : 0}`"
                class="rounded"
                :image="item.image"
                @pointerdown="emit('drag-begin', item)"
                @pointerup="emit('drag-begin')"
            />
        </v-hover>
    </div>
</template>

<style scoped>
.icon-div {
    display: inline-block;
}
</style>
