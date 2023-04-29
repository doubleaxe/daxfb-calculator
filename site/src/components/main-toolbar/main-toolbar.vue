<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {injectBlueprintModel} from '@/scripts/model/store';
import {autoLayoutGraph} from '@/scripts/graph';
import {mdiDotsVertical, mdiDelete, mdiSigma, mdiHome} from '@mdi/js';
import {ref} from 'vue';
import { injectGameData } from '@/scripts/data';

const gameData = injectGameData();
const blueprintModel = injectBlueprintModel();
const showSettingsDialog = ref(false);
const showHelpDialog = ref(false);
const showAboutDialog = ref(false);
const homeReference = [location.protocol, '//', location.host, location.pathname].join('')
    + `?gameId=${gameData.gameDescription.name}`;
</script>

<template>
    <tooltip-button
        tooltip="Solve graph"
        :icon="mdiSigma"
        :disabled="blueprintModel.autoSolveGraph"
        @click="blueprintModel.solveGraph(true)"
    />
    <v-switch v-model="blueprintModel.autoSolveGraph" label="Auto" hide-details class="mr-1" color="primary" />
    <v-divider vertical />
    <a :href="homeReference" target="_blank" class="anchor-plain">
        <tooltip-button
            tooltip="Open Another Window"
            :icon="mdiHome"
        />
    </a>
    <button-load-share />
    <button-save-share />
    <button-generate-link />
    <v-divider vertical />
    <button-scale />
    <slot name="append" />
    <v-menu>
        <template #activator="{ props }">
            <v-btn :icon="mdiDotsVertical" v-bind="props" />
        </template>
        <v-list>
            <v-list-item
                :prepend-icon="mdiDelete"
                title="Clear All"
                @click="blueprintModel.clear()"
            />
            <v-list-item
                :prepend-icon="mdiSigma"
                title="Auto Layout Graph"
                @click="autoLayoutGraph(blueprintModel)"
            />
            <v-divider horizontal />
            <button-settings is-menu @show-dialog="showSettingsDialog = true" />
            <button-help is-menu @show-dialog="showHelpDialog = true" />
            <button-about is-menu @show-dialog="showAboutDialog = true" />
        </v-list>
    </v-menu>
    <div class="d-none">
        <settings-dialog v-model="showSettingsDialog" />
        <help-dialog v-model="showHelpDialog" />
        <about-dialog v-model="showAboutDialog" />
    </div>
</template>
