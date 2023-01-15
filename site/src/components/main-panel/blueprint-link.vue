<script setup lang="ts">
import type {LinkModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {computed} from 'vue';

const props = defineProps<{
    link?: LinkModel;
}>();

const settings = injectSettings();
const buildLink = computed(() => {
    const link0 = props.link;
    const svgLink = link0?.buildShape()?.svgLink;
    return svgLink || '';
});
</script>

<template>
    <path
        :d="buildLink"
        stroke="black"
        fill="none"
        :stroke-width="settings.iconSize"
        class="link"
    />
</template>

<style scoped>
.link:hover {
    opacity: 0.7;
}
</style>
