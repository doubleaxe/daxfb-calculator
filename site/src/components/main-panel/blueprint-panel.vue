<script setup lang="ts">
import {ref, watch, computed} from 'vue';
import {injectBlueprintModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import LinkDraggable from './link-draggable.vue';
import ItemsDraggable from './items-draggable';
import {unrefElement, useEventListener} from '@vueuse/core';
import {Rect} from '@/scripts/geometry';

const settings = injectSettings();
const blueprintModel = injectBlueprintModel();
const blueprintsElement = ref<HTMLElement | null>(null);
const itemsDraggable = new ItemsDraggable();
const linkDraggableElement = ref<InstanceType<typeof LinkDraggable> | null>(null);

const computedStyle = computed(() => {
    const {boundingRect} = blueprintModel;
    return {
        width: boundingRect.width ? `${boundingRect.width}px` : '100%',
        height: boundingRect.width ? `${boundingRect.height}px` : '100%',
        /* transform: `scale(${settings.scale})`, */
    };
});
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
watch([blueprintsElement, () => settings.scale], () => updateBlueprintOffsetPosition());
blueprintModel.registerUpdateOffsetPosition(() => {
    const transformedRect = unrefElement(blueprintsElement)?.getBoundingClientRect();
    return Rect.assign(transformedRect);
});
</script>

<template>
    <div
        ref="blueprintsElement"
        class="blueprint-collection"
        :style="computedStyle"
    >
        <link-draggable ref="linkDraggableElement" />
        <blueprint-links />
        <template
            v-for="item in blueprintModel.items"
            :key="item.key"
        >
            <blueprint-single-item
                :item="item"
                class="blueprint-item"
                :style="{left: item.rect.x + 'px', top: item.rect.y + 'px'}"
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
    transform-origin: 0 0;
}
.blueprint-item {
    position: absolute;
}
</style>
