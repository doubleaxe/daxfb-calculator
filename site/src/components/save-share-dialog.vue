<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose, mdiContentCopy, mdiShareVariant, mdiCheck} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';
import {useClipboard, useShare, useVModel} from '@vueuse/core';
import {injectBlueprintModel} from '@/scripts/model/store';
import {ref, watch} from 'vue';
import {BlueprintEncoder} from '@/scripts/model/serializer';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);

const settings = injectSettings();
const blueprintModel = injectBlueprintModel();

const encodedBlueprint = ref('');
const splitBlueprint = ref('');

const {copy, copied, isSupported: isClipboardSupported} = useClipboard();
const {share, isSupported: isShareSupported} = useShare();

watch(() => props.modelValue, (value) => {
    if(value) {
        const encoder = new BlueprintEncoder(settings);
        const encoded = encoder.encode(blueprintModel.save());
        const split = encoder.split(encoded);
        encodedBlueprint.value = encoded;
        splitBlueprint.value = split;
    }
});
</script>

<template>
    <v-dialog v-model="dialog">
        <v-sheet>
            <v-toolbar>
                <v-toolbar-title>Share</v-toolbar-title>
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
                            class="text-monospaced"
                            label="Copy Blueprint Data"
                            variant="outlined"
                            readonly
                            hide-details
                            :model-value="splitBlueprint"
                        />
                    </v-col>
                    <v-col cols="1">
                        <tooltip-button
                            v-if="isClipboardSupported"
                            :icon="copied ? mdiCheck : mdiContentCopy"
                            tooltip="Copy To Clipboard"
                            @click="copy(splitBlueprint)"
                        />
                        <tooltip-button
                            v-if="isShareSupported"
                            class="mt-1"
                            :icon="mdiShareVariant"
                            tooltip="Share"
                            @click="share({title: 'Blueprint Data', text: splitBlueprint})"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-sheet>
    </v-dialog>
</template>
