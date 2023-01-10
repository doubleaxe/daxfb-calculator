<script setup lang="ts">
import {nextTick, ref, unref} from 'vue';
import {injectBlueprintModel} from './scripts/model/store';
import IconDraggable from './components/left-toolbox/icon-draggable.vue';
import {isPointInsideElement1, type PointType} from './scripts/geometry';
import {mdiContentSave, mdiFolderOutline, mdiDotsVertical, mdiDelete} from '@mdi/js';
import {solveGraph} from '@/scripts/graph';

const drawer = ref(true);
const draggableElement = ref<InstanceType<typeof IconDraggable> | null>(null);
const blueprintsElement = ref<HTMLElement | null>(null);
const blueprintModel = injectBlueprintModel();
const objectUrl = ref<string | null>(null);
const objectAnchor = ref<HTMLElement | null>(null);
const showInputFile = ref(false);
const inputFile = ref<HTMLElement | null>(null);

function dragDrop(dropPoint: PointType, itemName: string) {
    if(!isPointInsideElement1(blueprintsElement, dropPoint))
        return;
    const item = blueprintModel.addItem(itemName);
    item.rect.assignPoint(blueprintModel.screenToClient(dropPoint));
}

function saveBlueprint() {
    if(objectUrl.value) {
        URL.revokeObjectURL(objectUrl.value);
        objectUrl.value = null;
    }
    //recreate anchor
    nextTick(() => {
        const blob = new Blob([blueprintModel.save()], {type: 'application/json'});
        objectUrl.value = URL.createObjectURL(blob);
        nextTick(() => {
            unref(objectAnchor)?.click();
        });
    });
}
function loadingBlueprint() {
    showInputFile.value = false;
    //recreate input
    nextTick(() => {
        showInputFile.value = true;
        nextTick(() => {
            unref(inputFile)?.click();
        });
    });
}
function loadBlueprint() {
    if(!unref(inputFile))
        return;
    const selectedFiles = (unref(inputFile) as HTMLInputElement).files;
    if(!selectedFiles || !selectedFiles[0])
        return;
    const selectedFile = selectedFiles[0];
    const reader = new FileReader();
    reader.onload = function() {
        const fileContents = reader.result;
        if(typeof(fileContents) != 'string')
            return;
        blueprintModel.load(fileContents);
    };
    reader.readAsText(selectedFile);
}
</script>

<template>
    <icon-draggable ref="draggableElement" @drag-drop="dragDrop" />
    <v-app class="main-window">
        <v-app-bar density="compact">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </template>
            <template #append>
                <v-btn @click="solveGraph(blueprintModel, blueprintModel.items)">
                    Test
                </v-btn>
                <v-btn :icon="mdiContentSave" @click="saveBlueprint" />
                <a
                    v-if="objectUrl"
                    ref="objectAnchor"
                    download="blueprint.json"
                    :href="objectUrl"
                    class="d-none"
                />
                <v-btn :icon="mdiFolderOutline" @click="loadingBlueprint" />
                <input
                    v-if="showInputFile"
                    ref="inputFile"
                    type="file"
                    class="d-none"
                    accept=".json,application/json"
                    @change="loadBlueprint"
                >
                <v-menu>
                    <template #activator="{ props }">
                        <v-btn :icon="mdiDotsVertical" v-bind="props" />
                    </template>
                    <v-list>
                        <v-list-item
                            :prepend-icon="mdiDelete"
                            title="Clear"
                            @click="blueprintModel.clear()"
                        />
                    </v-list>
                </v-menu>
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
