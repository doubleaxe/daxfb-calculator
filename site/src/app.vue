<script setup lang="ts">
import {nextTick, ref, unref, reactive, watch, computed} from 'vue';
import {injectBlueprintModel} from './scripts/model/store';
import IconDraggable from './components/left-toolbox/icon-draggable.vue';
import {isPointInsideElement1, type PointType} from './scripts/geometry';
import {mdiContentSave, mdiFolderOutline, mdiDotsVertical, mdiDelete, mdiSync, mdiSigma} from '@mdi/js';

const drawer = ref(true);
const draggableElement = ref<InstanceType<typeof IconDraggable> | null>(null);
const blueprintsElement = ref<HTMLElement | null>(null);
const blueprintModel = injectBlueprintModel();
const objectUrl = ref<string | null>(null);
const objectAnchor = ref<HTMLElement | null>(null);
const showInputFile = ref(false);
const inputFile = ref<HTMLElement | null>(null);
const hasCycles = ref(false);
const hasAlerts = computed(() => unref(hasCycles));

function dragDrop(dropPoint: PointType, itemName: string) {
    if(!isPointInsideElement1(blueprintsElement, dropPoint))
        return;
    const item = reactive(blueprintModel.addItem(itemName));
    item.rect = item.rect.assignPoint(blueprintModel.screenToClient(dropPoint));
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
                <tooltip-button
                    tooltip="Solve links"
                    :icon="mdiSigma"
                    :disabled="blueprintModel.autoSolveGraph"
                    @click="blueprintModel.solveGraph()"
                />
                <v-switch v-model="blueprintModel.autoSolveGraph" label="Auto" hide-details class="mr-1" color="primary" />
                <v-divider vertical />
                <tooltip-button tooltip="Save" :icon="mdiContentSave" @click="saveBlueprint" />
                <a
                    v-if="objectUrl"
                    ref="objectAnchor"
                    download="blueprint.json"
                    :href="objectUrl"
                    class="d-none"
                />
                <tooltip-button tooltip="Load" :icon="mdiFolderOutline" @click="loadingBlueprint" />
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
