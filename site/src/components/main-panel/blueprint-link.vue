<script setup lang="ts">
import type {LinkModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {link, curveBumpX} from 'd3-shape';
import {computed} from 'vue';

const props = defineProps<{
    link?: LinkModel;
}>();

const settings = injectSettings();
const svgLinkBuilder = link(curveBumpX);
const buildLink = computed(() => {
    const link = props.link;
    const sourceRect = link?.input?.calculateRect();
    const targetRect = link?.output?.calculateRect();
    const svgLink = svgLinkBuilder({
        source: [sourceRect?.x || 0, sourceRect?.y || 0],
        target: [targetRect?.x || 0, targetRect?.y || 0],
    });
    return svgLink || '';
});
</script>

<template>
    <path
        :d="buildLink"
        stroke="black"
        fill="none"
        :stroke-width="settings.iconSize"
    />
</template>
