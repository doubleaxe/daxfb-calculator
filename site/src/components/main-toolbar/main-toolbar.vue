<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiSigma, mdiHome} from '@mdi/js';
import {injectGameData} from '@/scripts/data';

const gameData = injectGameData();
const blueprintModel = injectBlueprintModel();
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
    <main-toolbar-menu />
</template>
