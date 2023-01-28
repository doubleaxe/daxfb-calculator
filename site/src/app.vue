<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
-->
<script setup lang="ts">
import {ref, unref, watch, computed} from 'vue';
import {injectBlueprintModel} from './scripts/model/store';
import IconDraggable from './components/left-toolbox/icon-draggable.vue';
import BlueprintPanel from './components/main-panel/blueprint-panel.vue';
import {mdiSync} from '@mdi/js';

const drawer = ref(true);
const blueprintModel = injectBlueprintModel();
const hasCycles = ref(false);
const hasAlerts = computed(() => unref(hasCycles));

watch(() => blueprintModel.hasCycles, (value: boolean) => {
    //display only when changed, then user may hide it
    hasCycles.value = value;
});
</script>

<template>
    <icon-draggable />
    <v-app class="main-window">
        <v-app-bar density="compact">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </template>
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
        <v-footer v-if="hasAlerts" app>
            <v-alert v-model="hasCycles" type="warning" closable>
                Blueprint has cycles  - marked with
                <v-icon :icon="mdiSync" />
                icon. Cycles should have at least one output, otherwise they will not be calculated.
            </v-alert>
        </v-footer>
    </v-app>
</template>

<style scoped>
.main-window {
    height: 100%;
    width: 100%;
}
.main-scrollbar {
    height: 100%;
    display:inline-block;
    overflow: scroll;
}
</style>
