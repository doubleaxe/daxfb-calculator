<script setup lang="ts">
import type {LinkModel} from '@/scripts/model/store';
import {computed, ref, unref} from 'vue';

const props = defineProps<{
    link?: LinkModel;
}>();

const mainDivElement = ref<HTMLElement | null>(null);
const computedStyle = computed(() => {
    const link = props.link;
    let middlePoint = link?.buildShape()?.middlePoint;
    const mainDiv = unref(mainDivElement);
    if(!middlePoint || !mainDiv)
        return {};
    const mainDivRect = mainDiv.getBoundingClientRect();
    middlePoint = middlePoint.offsetBy({x: mainDivRect.width / 2, y: mainDivRect.height / 2}, -1);
    return {
        left: middlePoint.x + 'px',
        top: middlePoint.y + 'px',
    };
});
</script>

<template>
    <div ref="mainDivElement" class="rounded-pill link-connector bg-window-idle hover-border" :style="computedStyle">
        <icon-component :image="props.link?.input?.image" />
        <div class="mx-2" />
    </div>
</template>

<style scoped>
.link-connector {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
}
</style>
