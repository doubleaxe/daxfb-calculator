<script setup lang="ts">
import {Point} from '@/scripts/geometry';
import type {LinkModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {link, curveBumpX, line, curveBasis} from 'd3-shape';
import {computed, unref} from 'vue';

const props = defineProps<{
    link?: LinkModel;
}>();

const settings = injectSettings();
const CURVE_BREAKING_WIDTH = computed(() => settings.iconSize * 2);
const svgLinkBuilderStraight = link(curveBumpX);
const svgLinkBuilderCurved = line().curve(curveBasis);
const buildLink = computed(() => {
    const link = props.link;
    const sourcePoint = link?.output?.calculateLinkOrigin();
    const targetPoint = link?.input?.calculateLinkOrigin();
    if(!sourcePoint || !targetPoint)
        return '';
    const breakingWidth = unref(CURVE_BREAKING_WIDTH);
    if((targetPoint.x - sourcePoint.x) > breakingWidth) {
        const svgLink = svgLinkBuilderStraight({
            source: [sourcePoint?.x || 0, sourcePoint?.y || 0],
            target: [targetPoint?.x || 0, targetPoint?.y || 0],
        });
        return svgLink || '';
    }

    //important, that link will run through middle point, even if curved
    //so link connector will use the same algorithm for both
    const middlePoint = sourcePoint.middlePoint(targetPoint);
    const sourcePoint2 = new Point(sourcePoint).offsetBy({x: breakingWidth, y: 0});
    const targetPoint2 = new Point(targetPoint).offsetBy({x: -breakingWidth, y: 0});

    //build a square path then make curve for two segments
    const svgLink1 = svgLinkBuilderCurved([
        [sourcePoint.x, sourcePoint.y],
        [sourcePoint2.x, sourcePoint2.y],
        [sourcePoint2.x, middlePoint.y],
        [middlePoint.x, middlePoint.y],
    ]);
    const svgLink2 = svgLinkBuilderCurved([
        [middlePoint.x, middlePoint.y],
        [targetPoint2.x, middlePoint.y],
        [targetPoint2.x, targetPoint2.y],
        [targetPoint.x, targetPoint.y],
    ]);
    return (svgLink1 || '') + (svgLink2 || '');
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
