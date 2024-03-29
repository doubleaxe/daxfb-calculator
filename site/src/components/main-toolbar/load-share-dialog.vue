<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose, mdiContentPaste, mdiFileUploadOutline} from '@mdi/js';
import {useClipboard, useVModel} from '@vueuse/core';
import {injectBlueprintModel} from '@/scripts/model/store';
import {nextTick, ref, unref, watch} from 'vue';
import {useErrorHandler, loadBlueprint} from '@/composables';
import {injectGameData} from '@/scripts/data';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);

const gameData = injectGameData();
const blueprintModel = injectBlueprintModel();

const loadedBlueprint = ref('');
const showInputFile = ref(false);
const inputFile = ref<HTMLElement | null>(null);
const fileName = ref('');

const {isSupported: isClipboardSupported} = useClipboard();
const {showError} = useErrorHandler();
const ERROR_TITLE = 'Error loading blueprint';

watch(() => props.modelValue, (value) => {
    if(value) {
        loadedBlueprint.value = '';
    }
});

function paste() {
    navigator.clipboard.readText().then((text) => {
        loadedBlueprint.value = text;
        fileName.value = '';
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

function loadBlueprintFromFile() {
    if(!unref(inputFile))
        return;
    const selectedFiles = (unref(inputFile) as HTMLInputElement).files;
    if(!selectedFiles || !selectedFiles[0])
        return;
    const selectedFile = selectedFiles[0];
    const reader = new FileReader();
    reader.onload = function() {
        const fileContents = reader.result;
        if(typeof(fileContents) != 'string') {
            const error = new Error(`Invalid file type, expected "string", got "${typeof(fileContents)}"`);
            showError(ERROR_TITLE, error);
            return;
        }
        fileName.value = selectedFile.name;
        load(fileContents);
    };
    reader.onerror = function() {
        showError(ERROR_TITLE, reader.error);
    };
    reader.readAsText(selectedFile);
}


function load(encodedBlueprint?: string) {
    if(!encodedBlueprint) {
        encodedBlueprint = unref(loadedBlueprint);
    }
    loadBlueprint(gameData, blueprintModel, encodedBlueprint, fileName);
    dialog.value = false;
}
</script>

<template>
    <v-dialog v-model="dialog">
        <v-sheet>
            <v-toolbar>
                <v-toolbar-title>Load Blueprint</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-container>
                <div class="my-flex-xs-wrap mb-4">
                    <div class="flex-grow-1 mr-1 mt-2">
                        <v-textarea
                            v-model="loadedBlueprint"
                            class="text-monospaced textarea-overflow-auto"
                            label="Paste Blueprint Data"
                            variant="outlined"
                            hide-details
                        />
                    </div>
                    <div class="mt-2">
                        <v-btn
                            v-if="isClipboardSupported"
                            block
                            size="small"
                            class="mb-1"
                            :prepend-icon="mdiContentPaste"
                            @click="paste()"
                        >
                            Paste From Clipboard
                        </v-btn>
                        <v-btn
                            block
                            size="small"
                            color="secondary"
                            :prepend-icon="mdiFileUploadOutline"
                            @click="loadingBlueprint()"
                        >
                            Load From File
                        </v-btn>
                        <input
                            v-if="showInputFile"
                            ref="inputFile"
                            type="file"
                            class="d-none"
                            accept=".txt,text/plain"
                            @change="loadBlueprintFromFile()"
                        >
                    </div>
                </div>
                <v-row dense>
                    <v-btn
                        color="primary"
                        block
                        @click="load()"
                    >
                        Load Blueprint
                    </v-btn>
                </v-row>
            </v-container>
        </v-sheet>
    </v-dialog>
</template>
