<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';
import {useVModel} from '@vueuse/core';
import {DEFAULT_BLUEPRINT_SPLIT, DEFAULT_PRECISION, MIN_PRECISION} from '@/scripts/types';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);

const settings = injectSettings();
</script>

<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            fullscreen
        >
            <v-toolbar>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
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
                    <input-number
                        v-model="settings.solvePrecision"
                        :max="1"
                        :min="0"
                        :default-min="MIN_PRECISION"
                        :default-value="DEFAULT_PRECISION"
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
                    :disabled="!settings.dragAndDropEnabled"
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
                <v-list-item
                    :disabled="!settings.dragAndScrollEnabled"
                    title="Continue Drag And Scroll Outside"
                    @click="settings.dragAndScrollOutsideWindow = !settings.dragAndScrollOutsideWindow"
                >
                    <template #subtitle>
                        When enabled drag and scroll will continue if mouse cursor is dragged outside scrollable window.
                        Could be disabled to fight some scroll glitches on Firefox.
                    </template>
                    <template #prepend>
                        <v-checkbox v-model="settings.dragAndScrollOutsideWindow" />
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
                <v-list-item title="Enable Scale On Wheel" @click="settings.scrollScaleEnabled = !settings.scrollScaleEnabled">
                    <template #subtitle>
                        When enabled blueprint will scale when mouse wheel is rotated.
                    </template>
                    <template #prepend>
                        <v-checkbox v-model="settings.scrollScaleEnabled" />
                    </template>
                </v-list-item>
                <v-list-subheader>Save (advanced)</v-list-subheader>
                <v-list-item title="Compress Saved Data" @click="settings.blueprintCompress = !settings.blueprintCompress">
                    <template #subtitle>
                        Decreases size for big blueprints.
                    </template>
                    <template #prepend>
                        <v-checkbox v-model="settings.blueprintCompress" />
                    </template>
                </v-list-item>
                <v-list-item
                    :disabled="settings.blueprintCompress"
                    title="Encode Saved Data"
                    @click="settings.blueprintEncode = !settings.blueprintEncode"
                >
                    <template #subtitle>
                        Encodes raw blueprint JSON to Base64. Better for sharing blueprint text.
                    </template>
                    <template #prepend>
                        <v-checkbox v-model="settings.blueprintEncode" />
                    </template>
                </v-list-item>
                <v-list-item
                    :disabled="!settings.blueprintCompress && !settings.blueprintEncode"
                    title="Split Encoded Data"
                >
                    <template #subtitle>
                        Splits to chunks with new line. Better for sharing. Set 0 to disable splitting.
                    </template>
                    <input-number
                        v-model="settings.blueprintSplit"
                        :min="0"
                        :default-value="DEFAULT_BLUEPRINT_SPLIT"
                    />
                </v-list-item>
            </v-list>
        </v-dialog>
    </v-row>
</template>
