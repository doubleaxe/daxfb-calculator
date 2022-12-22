<script setup lang="ts">
import {dataProvider} from '@/scripts/data/data';

const emit = defineEmits<{
    (e: 'drag-begin', item?: typeof producerItems[0]): void;
    (e: 'drag-force'): void;
}>();

const producerItems = dataProvider.getProducerItems();
</script>

<template>
    <optimized-tooltip class="icon-div-parent">
        <template v-for="item in producerItems" :key="item.name">
            <icon-component
                class="rounded icon-div bg-hover-border"
                :image="item.image"
                :data-tooltip="item.label"
                @pointerdown="emit('drag-begin', item)"
                @pointerup="emit('drag-begin')"
            />
        </template>
    </optimized-tooltip>
</template>

<style scoped>
.icon-div-parent {
    line-height: 0px;
    font-size: 0px;
}
.icon-div {
    display: inline-block;
    padding: 1px;
}
</style>
