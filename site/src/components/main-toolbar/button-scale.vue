<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {computed} from 'vue';
import {mdiMagnify} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';

const settings = injectSettings();

const scalePercent = computed({
    get: () => Math.round(settings.scale * 100),
    set: (value: number) => { settings.scale = value / 100; },
});
</script>

<template>
    <v-menu density="compact" :close-on-content-click="false">
        <template #activator="{ props }">
            <tooltip-button tooltip="Scale" :icon="mdiMagnify" v-bind="props" />
        </template>
        <v-sheet min-width="300">
            <v-slider
                v-model="scalePercent"
                class="scale-slider"
                :min="50"
                :max="200"
                :step="10"
            >
                <template #append>
                    <v-chip>{{ scalePercent }} %</v-chip>
                </template>
            </v-slider>
        </v-sheet>
    </v-menu>
</template>

<style scoped>
.scale-slider {
    margin-left: 1em;
    margin-right: 1em;
    margin-top: 1em;
}
</style>
