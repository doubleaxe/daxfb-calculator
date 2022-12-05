<script setup lang="ts">
import {ref} from 'vue';
import {useBlueprintModel} from './scripts/model/store';
import {useDropHelper} from './scripts/drop-helper';
import type {DropHelper} from './scripts/drop-helper';
import type IconDraggable from './components/left-toolbox/icon-draggable.vue';

const drawer = ref(true);
const draggable = ref<InstanceType<typeof IconDraggable> | null>(null);
const blueprints = ref<HTMLElement | null>(null);

const dropHelperProcessor: DropHelper<string> = (dropPoint: {x: number; y: number}, itemName: string) => {
    const {blueprint} = useBlueprintModel();
    const item = blueprint.addItem(itemName);
    item.x.value = dropPoint.x;
    item.y.value = dropPoint.y;
};
const dropHelper = useDropHelper(blueprints, dropHelperProcessor, {scrollableParent: true});
</script>

<template>
    <icon-draggable ref="draggable" @drag-drop="dropHelper" />
    <v-app class="main-window">
        <v-app-bar density="compact">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </template>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer">
            <icon-list-panel @drag-begin="draggable?.requestDragBegin" @drag-force="draggable?.requestDragForce" />
        </v-navigation-drawer>
        <v-main scrollable>
            <blueprint-panel ref="blueprints" />
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
