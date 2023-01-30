<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {computed, nextTick, ref, unref} from 'vue';
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiContentSave, mdiFolderOutline, mdiDotsVertical, mdiDelete, mdiSigma, mdiMagnify, mdiCog} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';
import {BlueprintDecoder, BlueprintEncoder} from '@/scripts/model/serializer';

const blueprintModel = injectBlueprintModel();
const settings = injectSettings();
const objectUrl = ref<string | null>(null);
const objectAnchor = ref<HTMLElement | null>(null);
const showInputFile = ref(false);
const inputFile = ref<HTMLElement | null>(null);
const showSettingsDialog = ref(false);

const scalePercent = computed({
    get: () => Math.round(settings.scale * 100),
    set: (value: number) => { settings.scale = value / 100; },
});

function saveBlueprint() {
    if(objectUrl.value) {
        URL.revokeObjectURL(objectUrl.value);
        objectUrl.value = null;
    }
    //recreate anchor
    nextTick(() => {
        const encoder = new BlueprintEncoder(settings);
        const encoded = encoder.split(encoder.encode(blueprintModel.save()));
        const blob = new Blob([encoded], {type: 'text/plain'});
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
        const decoder = new BlueprintDecoder();
        const decoded = decoder.decode(fileContents);
        if(!decoded)
            return;
        blueprintModel.load(decoded);
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
        download="blueprint.txt"
        :href="objectUrl"
        class="d-none"
    />
    <tooltip-button tooltip="Load" :icon="mdiFolderOutline" @click="loadingBlueprint" />
    <input
        v-if="showInputFile"
        ref="inputFile"
        type="file"
        class="d-none"
        accept=".txt,text/plain"
        @change="loadBlueprint"
    >
    <v-divider vertical />
    <v-menu density="compact" :close-on-content-click="false">
        <template #activator="{ props }">
            <tooltip-button tooltip="Scale" :icon="mdiMagnify" v-bind="props" />
        </template>
        <v-sheet min-width="300">
            <v-slider
                v-model="scalePercent"
                class="scale-slider"
                :min="50"
                :max="200"
                :step="10"
            >
                <template #append>
                    <v-chip>{{ scalePercent }} %</v-chip>
                </template>
            </v-slider>
        </v-sheet>
    </v-menu>
    <tooltip-button
        tooltip="Settings"
        :icon="mdiCog"
        @click="showSettingsDialog = true"
    />
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
    <div class="d-none">
        <settings-dialog v-model="showSettingsDialog" />
    </div>
</template>

<style scoped>
.scale-slider {
    margin-left: 1em;
    margin-right: 1em;
    margin-top: 1em;
}
</style>
