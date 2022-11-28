<script setup lang="ts">
import {ref, unref} from 'vue';
import {useBlueprintModel} from './scripts/blueprint-model';
import {useElementBounding, unrefElement} from '@vueuse/core';
import {Point, Vector, Rectangle} from 'ts-2d-geometry';
import type IconDraggable from './components/icon-draggable.vue';

const draggable = ref<InstanceType<typeof IconDraggable> | null>(null);
const blueprints = ref<HTMLElement | null>(null);

const dropItem = (itemName: string, {x: screenX, y: sceenY}: {x: number, y: number}) => {
    const blueprintsRaw = unrefElement(blueprints);
    const scrollboxRaw = blueprintsRaw?.parentElement;
    const options = {
        windowResize: false,
        windowScroll: false,
    };
    const {
        x: blueprintX,
        y: blueprintY,
    } = useElementBounding(blueprintsRaw, options);
    const {
        x: scrollboxX,
        y: scrollboxY,
        width: scrollboxWidth,
        height: scrollboxHeight
    } = useElementBounding(scrollboxRaw, options);
    const screenPoint = new Point(screenX, sceenY);
    const scrollboxOrigin = new Point(unref(scrollboxX), unref(scrollboxY));
    const boundingRect = new Rectangle(
        scrollboxOrigin,
        scrollboxOrigin.plus(new Vector(unref(scrollboxWidth), unref(scrollboxHeight))),
    );
    if(boundingRect.toPolygon().containsPoint(screenPoint)) {
        const blueprintOrigin = new Point(unref(blueprintX), unref(blueprintY));
        const blueprintPoint = screenPoint.minus(blueprintOrigin);
        const {blueprint} = useBlueprintModel();
        const item = blueprint.addItem(itemName);
        item.x = blueprintPoint.x;
        item.y = blueprintPoint.y;
    }
};

</script>

<template>
    <icon-draggable ref="draggable" @drag-drop="dropItem" />
    <n-layout has-sider class="main-window">
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="10"
            width="20%"
            :default-collapsed="false"
            :show-collapsed-content="false"
            show-trigger="arrow-circle"
        >
            <icon-list-panel @drag-begin="draggable?.requestDragBegin" @drag-force="draggable?.requestDragForce" />
        </n-layout-sider>
        <n-layout-content content-style="overflow-x: auto;">
            <blueprint-panel ref="blueprints" class="blueprints" />
        </n-layout-content>
    </n-layout>
</template>

<style scoped>
.main-window {
    height: 100%;
    width: 100%;
}
.blueprints {
    min-height: 100%;
    min-width: 100%;
}
</style>
