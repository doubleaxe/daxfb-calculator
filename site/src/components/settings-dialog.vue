<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose, mdiCheck} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';
import {useVModel} from '@vueuse/core';
import {ref, unref} from 'vue';
import {DEFAULT_PRECISION, MIN_PRECISION} from '@/scripts/types';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);

const settings = injectSettings();
const solvePrecision = ref<string | number>(settings.solvePrecision);

function updateSolvePrecision() {
    let value = unref(solvePrecision);
    if(typeof(value) != 'number') {
        value = parseFloat(value);
    }
    if(isNaN(value)) {
        value = DEFAULT_PRECISION;
    } else if(value >= 1) {
        value = 1;
    } else if(value <= 0) {
        value = MIN_PRECISION;
    }
    settings.solvePrecision = value;
    solvePrecision.value = value;
}
</script>

<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            fullscreen
        >
            <v-card>
                <v-toolbar>
                    <v-btn
                        :icon="mdiClose"
                        @click="dialog = false"
                    />
                    <v-toolbar-title>Settings</v-toolbar-title>
                </v-toolbar>
                <v-list subheader density="compact" :lines="false">
                    <v-list-subheader>Appearance</v-list-subheader>
                    <v-list-item title="Colorful Links" @click="settings.colorfulLinks = !settings.colorfulLinks">
                        <template #subtitle>
                            Draw links in color or black.
                        </template>
                        <template #prepend>
                            <v-checkbox v-model="settings.colorfulLinks" />
                        </template>
                    </v-list-item>
                    <v-list-subheader>Calculations</v-list-subheader>
                    <v-list-item title="Solve Precision">
                        <template #subtitle>
                            Less number - more preciese calculations of factory io at price of calclation time.
                            Default is ".001".
                        </template>
                        <v-text-field
                            v-model="solvePrecision"
                            density="compact"
                            hide-details
                            clearable
                            persistent-clear
                            type="number"
                            max="1"
                            min="0"
                            :append-inner-icon="mdiCheck"
                            @blur="updateSolvePrecision"
                            @click:append-inner="updateSolvePrecision"
                            @click:clear="solvePrecision = DEFAULT_PRECISION; updateSolvePrecision()"
                        />
                    </v-list-item>
                    <v-list-subheader>Actions</v-list-subheader>
                    <v-list-item title="Enable Drag And Drop" @click="settings.dragAndDropEnabled = !settings.dragAndDropEnabled">
                        <template #subtitle>
                            When enabled you can drag items from left panel to blueprint, drag links, drag factories.
                            Doesn't work on touchscreen devices.
                        </template>
                        <template #prepend>
                            <v-checkbox v-model="settings.dragAndDropEnabled" />
                        </template>
                    </v-list-item>
                    <v-list-item
                        v-if="settings.dragAndDropEnabled"
                        title="Auto Scroll On Overflow"
                        @click="settings.overflowScrollEnabled = !settings.overflowScrollEnabled"
                    >
                        <template #subtitle>
                            When enabled blueprint will scroll automatically when anything is dragged ouside of widnow.
                        </template>
                        <template #prepend>
                            <v-checkbox v-model="settings.overflowScrollEnabled" />
                        </template>
                    </v-list-item>
                    <v-list-item title="Enable Drag And Scroll" @click="settings.dragAndScrollEnabled = !settings.dragAndScrollEnabled">
                        <template #subtitle>
                            When enabled you can scroll blueprint by dragging it with mouse.
                            Unusable on touchscreen devices.
                        </template>
                        <template #prepend>
                            <v-checkbox v-model="settings.dragAndScrollEnabled" />
                        </template>
                    </v-list-item>
                    <v-list-item title="Enable Point And Click" @click="settings.pointAndClickEnabled = !settings.pointAndClickEnabled">
                        <template #subtitle>
                            When enabled you select items on left panel, links and then paste them with another click.
                            Also factory can be moved the same way with factory menu.
                            Designed for touchscreen devices, but can be used on PC.
                            If both "Enable Drag And Drop" and "Enable Point And Click" is selected,
                            there will be pause before drag started to distinct drag from click.
                        </template>
                        <template #prepend>
                            <v-checkbox v-model="settings.pointAndClickEnabled" />
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<style scoped>
.scale-slider {
    margin-left: 1em;
    margin-right: 1em;
    margin-top: 1em;
}
.scale-number {
    width: 5em;
}
</style>
