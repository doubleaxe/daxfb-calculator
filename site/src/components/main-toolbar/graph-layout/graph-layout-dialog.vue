<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {useErrorHandler} from '@/composables';
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiClose} from '@mdi/js';
import {useLocalStorage, useVModel} from '@vueuse/core';
import {computed, onUnmounted, ref, unref, watch} from 'vue';
import {injectSettings} from '@/scripts/settings';
import {knownLayoutAlgorithms, layoutFactory, LayoutType, type CommonLayoutOptions} from '@/scripts/graph';

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

const layoutFactories: Map<LayoutType, string> = new Map([
    [LayoutType.ELK, 'Elk.js'],
    [LayoutType.DAGRE, 'Dagre'],
]);
const layoutFactoriesRevert = new Map([...layoutFactories.entries()].map(([key, value]) => [value, key]));

const layoutSettings = useLocalStorage('layout-settings', {
    layoutFactory: LayoutType.ELK,
    layoutOptions: {
        nodeSpacing: 100,
        connectedNodeSpacing: 100,
        edgeSpacing: 10,
    },
    layoutAlgorithmElk: knownLayoutAlgorithms(LayoutType.ELK).default,
    layoutAlgorithmDagre: knownLayoutAlgorithms(LayoutType.DAGRE).default,
} as {
    layoutFactory: LayoutType;
    layoutOptions: CommonLayoutOptions;
    layoutAlgorithmElk: string;
    layoutAlgorithmDagre: string;
}, {mergeDefaults: true});

const selectedLayoutFactory = computed({
    get() { return layoutFactories.get(unref(layoutSettings).layoutFactory); },
    set(value) { layoutSettings.value.layoutFactory = layoutFactoriesRevert.get(value || '') || LayoutType.ELK; },
});


function performAutoLayoutGraph() {
    isProcessing.value = true;
    abortController = new AbortController();
    const signal = abortController.signal;
    const _layoutSettings = unref(layoutSettings);
    const layoutType = _layoutSettings.layoutFactory;
    const layoutOptions: CommonLayoutOptions = {
        edgeWidth: settings.iconSize,
        ..._layoutSettings.layoutOptions,
        algorithms: (layoutType === LayoutType.DAGRE) ?
            _layoutSettings.layoutAlgorithmDagre :
            _layoutSettings.layoutAlgorithmElk,
    };
    layoutFactory(layoutType)
        .then((autoLayoutGraph) => autoLayoutGraph(blueprintModel, layoutOptions, signal))
        .then(() => {
            dialog.value = false;
        })
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
                    <v-col>
                        <input-number
                            v-model="layoutSettings.layoutOptions.nodeSpacing"
                            label="Vertical Node Spacing"
                            :min="0"
                            :default-value="100"
                        />
                    </v-col>
                    <v-col>
                        <input-number
                            v-model="layoutSettings.layoutOptions.connectedNodeSpacing"
                            label="Horizontal Node Spacing"
                            :min="0"
                            :default-value="100"
                        />
                    </v-col>
                </v-row>
                <v-row dense class="mt-2">
                    <v-col>
                        <input-number
                            v-model="layoutSettings.layoutOptions.edgeSpacing"
                            label="Edge Spacing"
                            :min="0"
                            :default-value="10"
                        />
                    </v-col>
                    <v-col>
                        <algorithm-selector-elk
                            v-if="layoutSettings.layoutFactory === LayoutType.ELK"
                            v-model="layoutSettings.layoutAlgorithmElk"
                        />
                        <algorithm-selector-dagre
                            v-if="layoutSettings.layoutFactory === LayoutType.DAGRE"
                            v-model="layoutSettings.layoutAlgorithmDagre"
                        />
                    </v-col>
                </v-row>
                <v-row dense class="mt-2">
                    <v-col>
                        <v-select
                            v-model="selectedLayoutFactory"
                            :items="[...layoutFactories.values()]"
                            label="Layout processor"
                            density="compact"
                            hide-details
                        />
                    </v-col>
                    <v-col>
                        <v-btn
                            color="primary"
                            block
                            @click="performAutoLayoutGraph()"
                        >
                            Perform Automatic Layout
                        </v-btn>
                    </v-col>
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
