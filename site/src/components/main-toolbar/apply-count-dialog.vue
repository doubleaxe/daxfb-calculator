<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiClose} from '@mdi/js';
import {useVModel} from '@vueuse/core';
import {ref, unref} from 'vue';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);
const roundingMode = ref('ceil');
const blueprintModel = injectBlueprintModel();

function applyFactoryCounts() {
    const roundToCeil = unref(roundingMode) === 'ceil';
    const setOne = unref(roundingMode) === 'one';
    blueprintModel.applyCalculatedFactoryCount((solvedCount) => {
        if(roundToCeil) {
            return Math.ceil(solvedCount);
        }
        if(setOne) {
            return 1;
        }
        return solvedCount;
    });
    dialog.value = false;
}
</script>

<template>
    <v-dialog v-model="dialog">
        <v-sheet>
            <v-toolbar>
                <v-toolbar-title>Automatically Apply Factory Counts</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-container>
                <v-alert type="warning">
                    This will apply automatically calculated factory counts for all factories.
                    In result manually set counts will be equal to automatically calculated ones.
                </v-alert>
                <v-row dense class="mt-2">
                    <v-col>
                        <v-radio-group v-model="roundingMode" inline>
                            <v-radio
                                label="Round to nearest greater integer"
                                value="ceil"
                            />
                            <v-radio
                                label="Set fractional counts"
                                value="fractional"
                            />
                            <v-radio
                                label="Set all counts to 1"
                                value="one"
                            />
                        </v-radio-group>
                    </v-col>
                </v-row>
                <v-row dense class="mt-2">
                    <v-col>
                        <v-btn
                            color="primary"
                            block
                            @click="applyFactoryCounts()"
                        >
                            Apply Factory Counts
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-sheet>
    </v-dialog>
</template>
