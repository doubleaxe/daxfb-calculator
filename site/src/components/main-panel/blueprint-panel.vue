<script setup lang="ts">
import {ref, computed} from 'vue';
import {useBlueprintModel} from '../../scripts/model/store';
import type IconDraggable from './link-draggable.vue';

const {blueprint} = useBlueprintModel();
const xmax = computed(() => blueprint.xmax + 200);
const ymax = computed(() => blueprint.ymax + 200);
const draggable = ref<InstanceType<typeof IconDraggable> | null>(null);
</script>

<template>
    <div class="blueprint-collection" :style="{width: xmax + 'px', height: ymax + 'px'}">
        <link-draggable ref="draggable" />
        <blueprint-links />
        <div
            v-for="item in blueprint.items"
            :key="item.key"
            class="blueprint-item"
            :style="{left: item.x + 'px', top: item.y + 'px'}"
        >
            <blueprint-single-item :item="item" />
        </div>
    </div>
</template>

<style scoped>
.blueprint-collection {
    position: relative;
    min-height: 100%;
    min-width: 100%;
}
.blueprint-item {
    position: absolute;
}
.scroll-helper {
    /* give some free space, so new items can be placed further */
    position: absolute;
    left: 0px;
    top: 0px;
    width: 200px;
    height: 200px;
    z-index: -1;
}
</style>
