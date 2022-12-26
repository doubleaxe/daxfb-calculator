<script setup lang="ts">
import type {LinkModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {computed, ref, unref} from 'vue';

const props = defineProps<{
    link?: LinkModel;
}>();

const settings = injectSettings();
const mainDivElement = ref<HTMLElement | null>(null);
const computedStyle = computed(() => {
    const link = props.link;
    const sourcePoint = link?.input?.calculateLinkOrigin();
    const targetPoint = link?.output?.calculateLinkOrigin();
    const mainDiv = unref(mainDivElement);
    if(!sourcePoint || !targetPoint || !mainDiv)
        return {};
    const mainDivRect = mainDiv.getBoundingClientRect();
    const middlePoint = sourcePoint.middlePoint(targetPoint).offsetBy({x: mainDivRect.width / 2, y: mainDivRect.height / 2}, -1);
    return {
        left: middlePoint.x + 'px',
        top: middlePoint.y + 'px',
    };
});
</script>

<template>
    <div ref="mainDivElement" class="rounded-pill link-connector bg-window-idle hover-border" :style="computedStyle">
        <icon-component :image="props.link?.input?.image" />
        <div class="mx-2">
            200
        </div>
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
