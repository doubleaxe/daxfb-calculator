<script setup lang="ts">
import {injectBlueprintModel, type LinkModel} from '../../scripts/model/store';
import {link, curveBumpX} from 'd3-shape';

const svgLinkBuilder = link(curveBumpX);
const blueprintModel = injectBlueprintModel();
function buildLink(_link: LinkModel) {
    const svgLink = svgLinkBuilder({
        source: [_link.input?.pos.x || 0, _link.input?.pos.y || 0],
        target: [_link.output?.pos.x || 0, _link.output?.pos.y || 0],
    });
    return svgLink || '';
}
</script>

<template>
    <svg class="background-svg">
        <path
            v-for="_link in blueprintModel.tempLinks"
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
