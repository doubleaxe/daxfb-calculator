<script setup lang="ts">
import {ref, computed} from 'vue';
import {useBlueprintModel} from '../scripts/blueprint-model';
import {line, link, curveBumpX} from 'd3-shape';
import {select} from 'd3-selection';
import {unrefElement} from '@vueuse/core';

const {blueprint} = useBlueprintModel();
const xmax = computed(() => blueprint.xmax + 200);
const ymax = computed(() => blueprint.ymax + 200);
const data = computed(() => {
    const l = line();
    let a = l([[10, 60], [40, 90], [60, 10], [190, 10]]);

    const i = link(curveBumpX);
    a = i({source: [0, 0], target: [100, 150]});
    return a || '';
});
</script>

<template>
    <div class="blueprint-collection" :style="{width: xmax + 'px', height: ymax + 'px'}">
        <svg class="demo">
            <path :d="data" stroke="black" fill="none" />
        </svg>
        <div
            v-for="item in blueprint.items"
            :key="item.name"
            class="blueprint-item"
            :style="{left: item.x + 'px', top: item.y + 'px'}"
        >
            <blueprint-single-item :item="item" />
        </div>
    </div>
</template>

<style scoped>
.demo {
    width: 200px;
    height: 200px;
}
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
