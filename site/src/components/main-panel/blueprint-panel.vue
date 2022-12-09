<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import {injectBlueprintModel} from '../../scripts/model/store';
import LinkDraggable from './link-draggable.vue';
import ItemsDraggable from './items-draggable';
import {unrefElement, useEventListener} from '@vueuse/core';

const blueprintModel = injectBlueprintModel();
const blueprintsElement = ref<HTMLElement | null>(null);
const xmax = computed(() => blueprintModel.xmax + 2000);
const ymax = computed(() => blueprintModel.ymax + 2000);
const itemsDraggable = new ItemsDraggable();
const linkDraggableElement = ref<InstanceType<typeof LinkDraggable> | null>(null);

const updateBlueprintOffsetPosition = (evt?: Event) => {
    const _blueprintsElement = unrefElement(blueprintsElement);
    if(!_blueprintsElement)
        return;
    if(evt && (evt.target instanceof HTMLElement)) {
        if(!(evt.target as HTMLElement).contains(_blueprintsElement))
            return;
    }
    blueprintModel.requestUpdateOffsetPosition();
};
useEventListener(window, ['scroll', 'resize'], updateBlueprintOffsetPosition, {capture: true, passive: true});
watch(blueprintsElement, () => updateBlueprintOffsetPosition());
blueprintModel.registerUpdateOffsetPosition(() => unrefElement(blueprintsElement)?.getBoundingClientRect());
</script>

<template>
    <div ref="blueprintsElement" class="blueprint-collection" :style="{width: xmax + 'px', height: ymax + 'px'}">
        <link-draggable ref="linkDraggableElement" />
        <blueprint-links />
        <template
            v-for="item in blueprintModel.items"
            :key="item.key"
        >
            <blueprint-single-item
                :item="item"
                class="blueprint-item"
                :style="{left: item.pos.x + 'px', top: item.pos.y + 'px'}"
                @pointerdown="itemsDraggable.addDraggable(item, $event)"
                @link-drag-begin="linkDraggableElement?.requestDragBegin"
                @link-drag-force="linkDraggableElement?.requestDragForce"
            />
        </template>
    </div>
</template>

<style scoped>
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
