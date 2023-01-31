<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiDotsVertical, mdiDelete, mdiSigma} from '@mdi/js';

const blueprintModel = injectBlueprintModel();
</script>

<template>
    <tooltip-button
        tooltip="Solve links"
        :icon="mdiSigma"
        :disabled="blueprintModel.autoSolveGraph"
        @click="blueprintModel.solveGraph()"
    />
    <v-switch v-model="blueprintModel.autoSolveGraph" label="Auto" hide-details class="mr-1" color="primary" />
    <v-divider vertical />
    <button-save />
    <button-load />
    <v-divider vertical />
    <button-scale />
    <button-settings />
    <v-menu>
        <template #activator="{ props }">
            <v-btn :icon="mdiDotsVertical" v-bind="props" />
        </template>
        <v-list>
            <v-list-item
                :prepend-icon="mdiDelete"
                title="Clear"
                @click="blueprintModel.clear()"
            />
        </v-list>
    </v-menu>
</template>
