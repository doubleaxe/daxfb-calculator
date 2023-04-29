<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {useErrorHandler} from '@/composables';
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiClose} from '@mdi/js';
import {useVModel} from '@vueuse/core';
import {onUnmounted, ref, unref, watch} from 'vue';
import {injectSettings} from '@/scripts/settings';
import {autoLayoutGraph} from '@/scripts/graph';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);
const {showError} = useErrorHandler();
const settings = injectSettings();
const blueprintModel = injectBlueprintModel();

let abortController: AbortController | undefined = undefined;
const isProcessing = ref(false);

const nodeNodeSpacing = ref(100);

function performAutoLayoutGraph() {
    isProcessing.value = true;
    abortController = new AbortController();
    const signal = abortController.signal;
    const layoutOptions: Record<string, string> = {
        'org.eclipse.elk.spacing.nodeNode': String(unref(nodeNodeSpacing)),
        'org.eclipse.elk.edge.thickness': String(settings.iconSize),
    };
    autoLayoutGraph(blueprintModel, layoutOptions, signal)
        .catch((err) => {
            if((err as Error)?.name !== 'AbortError') {
                showError('Failed to auto layout', err);
            }
        })
        .finally(() => {
            isProcessing.value = false;
            abortController = undefined;
        });
}

onUnmounted(() => {
    abortController?.abort();
});
watch(() => props.modelValue, (value, oldValue) => {
    if(!value) {
        abortController?.abort();
    } else if(value && !oldValue) {
        isProcessing.value = false;
    }
});
</script>

<template>
    <v-dialog v-model="dialog">
        <v-sheet>
            <v-toolbar>
                <v-toolbar-title>Automatically Layout Blueprint</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-container style="position: relative;">
                <v-alert type="warning">
                    Automatic layout algorithm is not perfect, it can make blueprint even worse.
                    Currently there is no undo functionality, it is highly recommended to backup blueprint before performing auto layout.
                </v-alert>
                <v-row dense class="mt-2">
                    <input-number
                        v-model="nodeNodeSpacing"
                        label="Node Spacing"
                        :min="0"
                        :default-value="100"
                    />
                </v-row>
                <v-row dense class="mt-2">
                    <v-btn
                        color="primary"
                        block
                        @click="performAutoLayoutGraph()"
                    >
                        Perform Automatic Layout
                    </v-btn>
                </v-row>
                <v-overlay
                    v-model="isProcessing"
                    contained
                    persistent
                    class="d-flex align-center"
                >
                    <div class="d-flex justify-center">
                        <v-progress-circular indeterminate color="primary" />
                    </div>
                </v-overlay>
            </v-container>
        </v-sheet>
    </v-dialog>
</template>
