<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
-->
<script setup lang="ts">
import {nextTick, ref, unref} from 'vue';
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiContentSave, mdiFolderOutline, mdiDotsVertical, mdiDelete, mdiSigma} from '@mdi/js';

const blueprintModel = injectBlueprintModel();
const objectUrl = ref<string | null>(null);
const objectAnchor = ref<HTMLElement | null>(null);
const showInputFile = ref(false);
const inputFile = ref<HTMLElement | null>(null);

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
