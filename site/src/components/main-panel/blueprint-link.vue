<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
-->
<script setup lang="ts">
import type {LinkModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {computed} from 'vue';

const props = defineProps<{
    link?: LinkModel;
    color?: string;
}>();

const settings = injectSettings();
const buildLink = computed(() => {
    const link0 = props.link;
    const svgLink = link0?.buildShape()?.svgLink;
    return svgLink || '';
});

const colorClass = computed(() => {
    const defaultColor = 'link-stroke-black';
    if(props.color)
        return props.color;
    if(settings.colorfulLinks)
        return props.link?.colorClass || defaultColor;
    return defaultColor;
});
</script>

<template>
    <path
        :d="buildLink"
        fill="none"
        :stroke-width="settings.iconSize"
        class="link"
        :class="colorClass"
    />
</template>

<style scoped>
.link:hover {
    opacity: 0.7;
}
</style>
