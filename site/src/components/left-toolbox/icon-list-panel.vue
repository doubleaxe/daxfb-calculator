<script setup lang="ts">
import type {Item} from '@/scripts/data/data';
import {injectFilter} from '@/scripts/filter';

const emit = defineEmits<{
    (e: 'drag-begin', item?: Item): void;
    (e: 'drag-force'): void;
}>();

const filter = injectFilter();
</script>

<template>
    <div>
        <icon-list-filter />
        <div class="icon-div-parent">
            <optimized-tooltip>
                <template v-for="item in filter.buildFilter()" :key="item.name">
                    <icon-component
                        class="rounded icon-div hover-elevation"
                        :image="item.image"
                        :data-tooltip="item.label"
                        @pointerdown="emit('drag-begin', item)"
                        @pointerup="emit('drag-begin')"
                    />
                </template>
            </optimized-tooltip>
        </div>
    </div>
</template>

<style scoped>
.icon-div-parent {
    line-height: 0px;
    font-size: 0px;
}
.icon-div {
    display: inline-block;
}
</style>
