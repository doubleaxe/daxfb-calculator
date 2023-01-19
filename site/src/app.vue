<script setup lang="ts">
import {ref, unref, reactive, watch, computed} from 'vue';
import {injectBlueprintModel} from './scripts/model/store';
import {injectFilter} from './scripts/filter';
import IconDraggable from './components/left-toolbox/icon-draggable.vue';
import {isPointInsideElement1, type PointType} from './scripts/geometry';
import {mdiSync} from '@mdi/js';

const drawer = ref(true);
const draggableElement = ref<InstanceType<typeof IconDraggable> | null>(null);
const blueprintsElement = ref<HTMLElement | null>(null);
const blueprintModel = injectBlueprintModel();
const filter = injectFilter();
const hasCycles = ref(false);
const hasAlerts = computed(() => unref(hasCycles));

function dragDrop(dropPoint: PointType, itemName: string) {
    if(!isPointInsideElement1(blueprintsElement, dropPoint))
        return;
    const item = reactive(blueprintModel.addItem(itemName));
    item.rect = item.rect.assignPoint(blueprintModel.screenToClient(dropPoint));
    if(filter.key) {
        const preselectRecipe = item.possibleRecipeForItem(filter.key, filter.direction);
        if(preselectRecipe)
            item.selectRecipe(preselectRecipe);
    }
}

watch(() => blueprintModel.hasCycles, (value: boolean) => {
    //display only when changed, then user may hide it
    hasCycles.value = value;
});
</script>

<template>
    <icon-draggable ref="draggableElement" @drag-drop="dragDrop" />
    <v-app class="main-window">
        <v-app-bar density="compact">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </template>
            <template #append>
                <main-toolbar />
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
        <v-footer v-if="hasAlerts" app>
            <v-alert v-model="hasCycles" type="warning" closable>
                Blueprint has cycles  - marked with
                <v-icon :icon="mdiSync" />
                icon. Cycles should have at least one output, otherwise they will not be calculated.
            </v-alert>
        </v-footer>
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
