<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiDotsVertical, mdiDelete, mdiCog, mdiHelpCircle, mdiArrangeSendToBack, mdiCounter, mdiInformationOutline} from '@mdi/js';
import {ref} from 'vue';

const blueprintModel = injectBlueprintModel();
const showSettingsDialog = ref(false);
const showHelpDialog = ref(false);
const showAboutDialog = ref(false);
const showAutoLayoutDialog = ref(false);
const showApplyCountDialog = ref(false);
</script>

<template>
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
                :prepend-icon="mdiArrangeSendToBack"
                title="Auto Layout Graph"
                @click="showAutoLayoutDialog = true"
            />
            <v-list-item
                :prepend-icon="mdiCounter"
                title="Mass Apply Counts"
                @click="showApplyCountDialog = true"
            />
            <v-divider horizontal />
            <v-list-item
                :prepend-icon="mdiCog"
                title="Settings"
                @click="showSettingsDialog = true"
            />
            <v-list-item
                :prepend-icon="mdiHelpCircle"
                title="Help"
                @click="showHelpDialog = true"
            />
            <v-list-item
                :prepend-icon="mdiInformationOutline"
                title="About"
                @click="showAboutDialog = true"
            />
        </v-list>
    </v-menu>
    <div class="d-none">
        <graph-layout-dialog v-model="showAutoLayoutDialog" />
        <apply-count-dialog v-model="showApplyCountDialog" />
        <settings-dialog v-model="showSettingsDialog" />
        <help-dialog v-model="showHelpDialog" />
        <about-dialog v-model="showAboutDialog" />
    </div>
</template>
