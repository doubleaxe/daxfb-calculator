<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {nextTick, onBeforeMount, ref, unref, watch} from 'vue';
import {injectGameData} from '@/scripts/data';
import {provideBlueprintModel, type BlueprintModel} from '@/scripts/model/store';
import {provideFilter} from '@/scripts/filter';
import {provideSettings} from '@/scripts/settings';
import {mdiFormatListBulletedType} from '@mdi/js';
import {useAnalytics, loadBlueprint} from '@/composables';
import {useTheme} from 'vuetify';

const drawer = ref(true);
const showSummary = ref(false);
const showSummaryCompact = ref(false);
const gameData = injectGameData();
const blueprintModel = ref<BlueprintModel | undefined>();
const settings = ref<ReturnType<typeof provideSettings> | undefined>();
const theme = useTheme();

function toggleSummary() {
    //toggle in curcular way - hidden -> compact -> full
    if(unref(showSummary)) {
        if(unref(showSummaryCompact)) {
            showSummaryCompact.value = false;
        } else {
            showSummary.value = false;
            showSummaryCompact.value = true;
        }
    } else {
        showSummary.value = true;
        showSummaryCompact.value = true;
    }
    const _settings = unref(settings);
    if(_settings) {
        _settings.showSummary = unref(showSummary);
        _settings.showSummaryCompact = unref(showSummaryCompact);
    }
}

onBeforeMount(() => {
    useAnalytics(gameData.gameDescription.name);
    const _blueprintModel = provideBlueprintModel(gameData);
    const filter = provideFilter(gameData);
    const _settings = provideSettings(gameData, _blueprintModel, filter);
    document.title = `daxfb-calculator - calculator/factory planner for "${gameData.gameDescription.description}"`;

    const preloadBlueprint = gameData.preloadBlueprint;
    Promise.resolve()
        .then(() => new Promise((resolve) => { nextTick(() => resolve(undefined)); }))
        .then(() => new Promise((resolve) => {
            if(preloadBlueprint) {
                setTimeout(() => {
                    loadBlueprint(gameData, _blueprintModel, preloadBlueprint.data, preloadBlueprint.name);
                    gameData.initPreloadBlueprint(undefined);
                    resolve(undefined);
                }, 50);
            } else {
                resolve(undefined);
            }
        }))
        .then(() => {
            blueprintModel.value = _blueprintModel;

            //load at start, and don't watch for changes from another tabs
            showSummary.value = _settings.showSummary;
            showSummaryCompact.value = _settings.showSummaryCompact;
            settings.value = _settings;
        });
});

watch(() => unref(settings)?.darkTheme, () => {
    theme.global.name.value = unref(settings)?.darkTheme ? 'dark' : 'light';
});
</script>

<template>
    <icon-draggable v-if="blueprintModel" />
    <v-app v-if="blueprintModel" class="main-window">
        <v-app-bar density="compact">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </template>
            <v-app-bar-title>{{ `${blueprintModel?.blueprintName || ''}` }}</v-app-bar-title>
            <template #append>
                <main-toolbar>
                    <template #append>
                        <tooltip-button
                            tooltip="Toggle Summary"
                            :icon="mdiFormatListBulletedType"
                            @click="toggleSummary()"
                        />
                    </template>
                </main-toolbar>
            </template>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" permanent>
            <icon-list-panel />
        </v-navigation-drawer>
        <v-main scrollable>
            <blueprint-panel />
        </v-main>
        <v-navigation-drawer
            v-model="showSummary"
            permanent
            location="right"
            :rail="showSummaryCompact"
            :class="showSummaryCompact ? 'summary-no-overflow' : ''"
        >
            <!-- remove completely, so will not recalculate if not shown -->
            <summary-panel v-if="showSummary" :compact="showSummaryCompact" />
        </v-navigation-drawer>
    </v-app>
    <v-overlay
        v-if="!blueprintModel"
        model-value
        persistent
        class="align-center justify-center"
    >
        <v-progress-circular indeterminate color="primary" />
    </v-overlay>
</template>

<style scoped>
.main-window {
    height: 100%;
    width: 100%;
}
</style>

<style>
.summary-no-overflow, .summary-no-overflow > * {
    overflow-y: hidden!important;
}
</style>
