<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {nextTick, ref, unref} from 'vue';
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiFolderOutline} from '@mdi/js';
import {BlueprintDecoder} from '@/scripts/model/serializer';
import {useErrorHandler} from '@/composables/error-handler';
import {ErrorCollector} from '@/scripts/error-collector';

const {showError} = useErrorHandler();
const ERROR_TITLE = 'Error loading blueprint';

const blueprintModel = injectBlueprintModel();
const showInputFile = ref(false);
const inputFile = ref<HTMLElement | null>(null);

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
        if(typeof(fileContents) != 'string') {
            const error = new Error(`Invalid file type, expected "string", got "${typeof(fileContents)}"`);
            showError(ERROR_TITLE, error);
            return;
        }
        const errorCollector = new ErrorCollector();
        const decoder = new BlueprintDecoder(errorCollector);
        const decoded = decoder.decode(fileContents);
        if(!decoded || errorCollector.haveErrors) {
            showError(ERROR_TITLE, errorCollector);
            return;
        }
        blueprintModel.load(decoded, errorCollector);
        if(errorCollector.haveErrors) {
            showError('Blueprint possibly wasn\'t loaded correctly', errorCollector, true);
        }
    };
    reader.onerror = function() {
        showError(ERROR_TITLE, reader.error);
    };
    reader.readAsText(selectedFile);
}
</script>

<template>
    <tooltip-button tooltip="Load" :icon="mdiFolderOutline" @click="loadingBlueprint" />
    <input
        v-if="showInputFile"
        ref="inputFile"
        type="file"
        class="d-none"
        accept=".txt,text/plain"
        @change="loadBlueprint"
    >
</template>
