<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import {injectGameData} from '@/scripts/data';
import {provideBlueprintModel} from '@/scripts/model/store';
import {provideFilter} from '@/scripts/filter';
import {provideSettings} from '@/scripts/settings';

const drawer = ref(true);
const gameData = injectGameData();

onBeforeMount(() => {
    const blueprintModel = provideBlueprintModel(gameData);
    const filter = provideFilter(gameData);
    provideSettings(gameData, blueprintModel, filter);
    document.title = `${gameData.gameDescription.description} Calculator/Factory Planner by doubleaxe`;
});
</script>

<template>
    <icon-draggable />
    <v-app v-if="gameData" class="main-window">
        <v-app-bar density="compact">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </template>
            <v-app-bar-title>{{ `${gameData.gameDescription.description} Calculator/Factory Planner` }}</v-app-bar-title>
            <template #append>
                <main-toolbar />
            </template>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" permanent>
            <icon-list-panel />
        </v-navigation-drawer>
        <v-main scrollable>
            <blueprint-panel />
        </v-main>
    </v-app>
</template>

<style scoped>
.main-window {
    height: 100%;
    width: 100%;
}
</style>
