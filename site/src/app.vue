<script setup lang="ts">
import {ref, unref, reactive} from 'vue';
import {useBlueprintModel} from './scripts/blueprint-model';
import {useElementBounding} from '@vueuse/core';
import {Point, Vector, Rectangle} from 'ts-2d-geometry';
import type IconDraggable from './components/icon-draggable.vue';

const draggable = ref<InstanceType<typeof IconDraggable> | null>(null);
const blueprints = ref<HTMLElement | null>(null);
const {x: blueprintX, y: blueprintY, width: blueprintWidth, height: blueprintHeight} = useElementBounding(blueprints);

const dropItem = (itemName: string, {x: screenX, y: sceenY}: {x: number, y: number}) => {
    const screenPoint = new Point(screenX, sceenY);
    const blueprintOrigin = new Point(unref(blueprintX), unref(blueprintY));
    const boundingRect = new Rectangle(
        blueprintOrigin,
        blueprintOrigin.plus(new Vector(unref(blueprintWidth), unref(blueprintHeight))),
    );
    if(boundingRect.toPolygon().containsPoint(screenPoint)) {
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
