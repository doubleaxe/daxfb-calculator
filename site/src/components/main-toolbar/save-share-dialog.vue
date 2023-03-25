<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose, mdiContentCopy, mdiShareVariant, mdiCheck, mdiContentSave} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';
import {useClipboard, useDebounceFn, useShare, useVModel} from '@vueuse/core';
import {injectBlueprintModel} from '@/scripts/model/store';
import {nextTick, ref, unref, watch, computed} from 'vue';
import {BlueprintEncoder, FileNameHandler} from '@/scripts/model/serializer';
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
const blueprintName = ref('');
const fileName = computed(() => {
    return FileNameHandler.blueprintNameToFileName(unref(blueprintName));
});

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
    const handler = new FileNameHandler(settings);
    fullyEncodedBlueprint.value = handler.encodeBlueprintNameHeader(unref(splitBlueprint), unref(blueprintName));
}
const debouncedUpdateFullyEncodedBlueprint = useDebounceFn(updateFullyEncodedBlueprint, 200);

watch(() => props.modelValue, (value) => {
    if(value) {
        const encoder = new BlueprintEncoder(gameData, settings);
        const encoded = encoder.encode(blueprintModel.save());
        const split = encoder.split(encoded);
        splitBlueprint.value = split;
        blueprintName.value = blueprintModel.blueprintName;
        updateFullyEncodedBlueprint();
        nextTick(() => {
            unref(textArea)?.select();
        });
    }
});
watch(blueprintName, (value) => {
    if(!value) {
        blueprintName.value = blueprintModel.getDefaultBlueprintName();
    }
    debouncedUpdateFullyEncodedBlueprint();
    blueprintModel.blueprintName = unref(blueprintName);
});
</script>

<template>
    <v-dialog v-model="dialog">
        <v-sheet>
            <v-toolbar>
                <v-toolbar-title>Save / Share Blueprint</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-container>
                <v-row dense class="mb-2">
                    <v-col>
                        <v-text-field
                            v-model="blueprintName"
                            label="Edit Blueprint Description"
                            density="comfortable"
                            hide-details
                            clearable
                            @click:clear="blueprintName = blueprintModel.getDefaultBlueprintName()"
                        />
                    </v-col>
                </v-row>
                <div class="my-flex-xs-wrap">
                    <div class="flex-grow-1 mr-1 mt-2">
                        <v-textarea
                            ref="textArea"
                            class="text-monospaced textarea-overflow-auto"
                            label="Copy Blueprint Data"
                            variant="outlined"
                            readonly
                            hide-details
                            :model-value="fullyEncodedBlueprint"
                        />
                    </div>
                    <div class="mt-2">
                        <v-btn
                            v-if="isClipboardSupported"
                            block
                            size="small"
                            class="mb-1"
                            :prepend-icon="copied ? mdiCheck : mdiContentCopy"
                            @click="copy(fullyEncodedBlueprint)"
                        >
                            Copy To Clipboard
                        </v-btn>
                        <v-btn
                            v-if="isShareSupported"
                            block
                            size="small"
                            class="mb-1"
                            :prepend-icon="mdiShareVariant"
                            @click="share({title: blueprintModel.blueprintName, text: fullyEncodedBlueprint})"
                        >
                            Share
                        </v-btn>
                        <v-btn
                            block
                            size="small"
                            color="secondary"
                            :prepend-icon="mdiContentSave"
                            @click="saveBlueprint()"
                        >
                            Save To File
                        </v-btn>
                        <a
                            v-if="objectUrl"
                            ref="objectAnchor"
                            :download="fileName"
                            :href="objectUrl"
                            class="d-none"
                        />
                    </div>
                </div>
            </v-container>
        </v-sheet>
    </v-dialog>
</template>
