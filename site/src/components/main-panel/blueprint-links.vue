<script setup lang="ts">
import {useBlueprintModel, type LinkModel} from '../../scripts/model/store';
import {link, curveBumpX} from 'd3-shape';

const svgLinkBuilder = link(curveBumpX);
const {blueprint} = useBlueprintModel();
function buildLink(_link: LinkModel) {
    const svgLink = svgLinkBuilder({
        source: [_link.input?.x || 0, _link.input?.y || 0],
        target: [_link.output?.x || 0, _link.output?.y || 0],
    });
    return svgLink || '';
}
</script>

<template>
    <svg class="background-svg">
        <path
            v-for="_link in blueprint.tempLinks"
            :key="_link.key"
            :d="buildLink(_link)"
            stroke="black"
            fill="none"
        />
    </svg>
</template>

<style scoped>
.background-svg {
    width: 100%;
    height: 100%;
}
</style>
