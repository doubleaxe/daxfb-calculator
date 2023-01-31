<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose, mdiContentPaste} from '@mdi/js';
import {useClipboard, useVModel} from '@vueuse/core';
import {injectBlueprintModel} from '@/scripts/model/store';
import {ref, watch} from 'vue';
import {BlueprintDecoder} from '@/scripts/model/serializer';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);

const blueprintModel = injectBlueprintModel();

const loadedBlueprint = ref('');

const {isSupported: isClipboardSupported} = useClipboard();

watch(() => props.modelValue, (value) => {
    if(value) {
        loadedBlueprint.value = '';
    }
});
function paste() {
    navigator.clipboard.readText().then((text) => {
        loadedBlueprint.value = text;
    });
}
function load() {
    const decoder = new BlueprintDecoder();
    const decoded = decoder.decode(loadedBlueprint.value);
    if(!decoded)
        return;
    blueprintModel.load(decoded);
    dialog.value = false;
}
</script>

<template>
    <v-dialog v-model="dialog">
        <v-sheet>
            <v-toolbar>
                <v-toolbar-title>Load Shared</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-container>
                <v-row dense>
                    <v-col>
                        <v-textarea
                            v-model="loadedBlueprint"
                            class="text-monospaced"
                            label="Blueprint Data"
                            variant="outlined"
                            hide-details
                        />
                    </v-col>
                    <v-col cols="1">
                        <tooltip-button
                            v-if="isClipboardSupported"
                            :icon="mdiContentPaste"
                            tooltip="Paste From Clipboard"
                            @click="paste"
                        />
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-btn
                        color="primary"
                        block
                        @click="load"
                    >
                        Load Blueprint
                    </v-btn>
                </v-row>
            </v-container>
        </v-sheet>
    </v-dialog>
</template>
