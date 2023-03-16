<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose, mdiContentCopy, mdiShareVariant, mdiCheck, mdiContentSave} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';
import {useClipboard, useShare, useVModel} from '@vueuse/core';
import {injectBlueprintModel} from '@/scripts/model/store';
import {nextTick, ref, unref, watch} from 'vue';
import {BlueprintEncoder} from '@/scripts/model/serializer';
import {injectGameData} from '@/scripts/data';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);

const gameData = injectGameData();
const settings = injectSettings();
const blueprintModel = injectBlueprintModel();

const splitBlueprint = ref('');
const fullyEncodedBlueprint = ref('');
const textArea = ref<HTMLTextAreaElement | undefined>();
const objectUrl = ref<string | null>(null);
const objectAnchor = ref<HTMLElement | null>(null);

const {copy, copied, isSupported: isClipboardSupported} = useClipboard();
const {share, isSupported: isShareSupported} = useShare();

function saveBlueprint() {
    if(objectUrl.value) {
        URL.revokeObjectURL(objectUrl.value);
        objectUrl.value = null;
    }
    //recreate anchor
    nextTick(() => {
        const split = unref(fullyEncodedBlueprint);
        const blob = new Blob([split], {type: 'text/plain'});
        objectUrl.value = URL.createObjectURL(blob);
        nextTick(() => {
            unref(objectAnchor)?.click();
        });
    });
}

function updateFullyEncodedBlueprint() {
    const encoder = new BlueprintEncoder(gameData, settings);
    fullyEncodedBlueprint.value = encoder.encodeDescriptionHeader(unref(splitBlueprint), blueprintModel.blueprintName);
}

watch(() => props.modelValue, (value) => {
    if(value) {
        const encoder = new BlueprintEncoder(gameData, settings);
        const encoded = encoder.encode(blueprintModel.save());
        const split = encoder.split(encoded);
        splitBlueprint.value = split;
        updateFullyEncodedBlueprint();
        nextTick(() => {
            unref(textArea)?.select();
        });
    }
});
watch(() => blueprintModel.blueprintName, () => {
    updateFullyEncodedBlueprint();
});
</script>

<template>
    <v-dialog v-model="dialog">
        <v-sheet>
            <v-toolbar>
                <v-toolbar-title>Save / Share</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-container>
                <v-row dense>
                    <v-col cols="6">
                        <v-text-field
                            v-model="blueprintModel.fileName"
                            label="File Name"
                            density="comfortable"
                            hide-details
                            clearable
                            @click:clear="blueprintModel.resetFileName(true)"
                        />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            v-model="blueprintModel.blueprintName"
                            label="Blueprint Description"
                            density="comfortable"
                            hide-details
                            clearable
                            @click:clear="blueprintModel.resetBlueprintName(true)"
                        />
                    </v-col>
                </v-row>
                <v-row dense class="mt-4">
                    <v-col>
                        <v-textarea
                            ref="textArea"
                            class="text-monospaced"
                            label="Copy Blueprint Data"
                            variant="outlined"
                            readonly
                            hide-details
                            :model-value="fullyEncodedBlueprint"
                        />
                    </v-col>
                    <v-col cols="1">
                        <tooltip-button
                            v-if="isClipboardSupported"
                            :icon="copied ? mdiCheck : mdiContentCopy"
                            tooltip="Copy To Clipboard"
                            @click="copy(fullyEncodedBlueprint)"
                        />
                        <tooltip-button
                            v-if="isShareSupported"
                            class="mt-1"
                            :icon="mdiShareVariant"
                            tooltip="Share"
                            @click="share({title: blueprintModel.blueprintName, text: fullyEncodedBlueprint})"
                        />
                        <tooltip-button tooltip="Save" :icon="mdiContentSave" @click="saveBlueprint" />
                        <a
                            v-if="objectUrl"
                            ref="objectAnchor"
                            :download="blueprintModel.fileName"
                            :href="objectUrl"
                            class="d-none"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-sheet>
    </v-dialog>
</template>
