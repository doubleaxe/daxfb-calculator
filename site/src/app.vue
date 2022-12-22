<script setup lang="ts">
import {ref} from 'vue';
import {injectBlueprintModel} from './scripts/model/store';
import IconDraggable from './components/left-toolbox/icon-draggable.vue';
import {isPointInsideElement1, type PointType} from './scripts/geometry';

const drawer = ref(true);
const draggableElement = ref<InstanceType<typeof IconDraggable> | null>(null);
const blueprintsElement = ref<HTMLElement | null>(null);
const blueprintModel = injectBlueprintModel();

function dragDrop(dropPoint: PointType, itemName: string) {
    if(!isPointInsideElement1(blueprintsElement, dropPoint))
        return;
    const item = blueprintModel.addItem(itemName);
    item.rect.assignPoint(blueprintModel.screenToClient(dropPoint));
}
</script>

<template>
    <icon-draggable ref="draggableElement" @drag-drop="dragDrop" />
    <v-app class="main-window">
        <v-app-bar density="compact">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </template>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" permanent>
            <icon-list-panel
                @drag-begin="draggableElement?.requestDragBegin"
                @drag-force="draggableElement?.requestDragForce"
            />
        </v-navigation-drawer>
        <v-main scrollable>
            <blueprint-panel ref="blueprintsElement" />
        </v-main>
    </v-app>
</template>

<style scoped>
.main-window {
    height: 100%;
    width: 100%;
}
.main-scrollbar {
    height: 100%;
    display:inline-block;
    overflow: scroll;
}
</style>
