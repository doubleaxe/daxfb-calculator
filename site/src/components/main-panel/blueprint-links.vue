<script setup lang="ts">
import {computed} from 'vue';
import {line, link, curveBumpX} from 'd3-shape';

const data = computed(() => {
    const l = line();
    let a = l([[10, 60], [40, 90], [60, 10], [190, 10]]);

    const i = link(curveBumpX);
    a = i({source: [0, 0], target: [100, 150]});
    return a || '';
});
</script>

<template>
    <svg class="background-svg">
        <path :d="data" stroke="black" fill="none" />
    </svg>
</template>

<style scoped>
.background-svg {
    width: 100%;
    height: 100%;
}
</style>
