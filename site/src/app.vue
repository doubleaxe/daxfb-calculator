<script setup lang="ts">
import {ref, unref} from 'vue';
import {useBlueprintModel} from './scripts/blueprint-model';
import {useElementBounding} from '@vueuse/core';

const blueprints = ref<HTMLElement | null>(null);
const {x: blueprintX, y: blueprintY, width: blueprintWidth, height: blueprintHeight} = useElementBounding(blueprints);

const dropItem = (itemName: string, {x: screenX, y: sceenY}: {x: number, y: number}) => {
    /*
    const screenPoint = new Point(screenX, sceenY);
    const blueprintOrigin = new Plane(new Point(unref(blueprintX), unref(blueprintY)));
    const boundingRect = new Rectangle(
        blueprintOrigin,
        unref(blueprintWidth),
        unref(blueprintHeight),
    );
    if(boundingRect.contains(screenPoint)) {
        const blueprintPoint = blueprintOrigin.remapToPlaneSpace(screenPoint);
        const {blueprint} = useBlueprintModel();
        const item = blueprint.addItem(itemName);
        item.x = blueprintPoint.x;
        item.y = blueprintPoint.y;
    }
    */
};
</script>

<template>
    <n-layout has-sider class="main-window">
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="10"
            width="20%"
            :default-collapsed="false"
            :show-collapsed-content="false"
            show-trigger
        >
            <icon-list-panel @drop="dropItem" />
        </n-layout-sider>
        <n-layout-content>
            <blueprint-panel ref="blueprints" />
        </n-layout-content>
    </n-layout>
</template>

<style scoped>
.main-window {
    height: 100%;
    width: 100%;
}
</style>
