<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {ref} from 'vue';
import {mdiShareVariant, mdiContentSave} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';

const settings = injectSettings();
const showShareDialog = ref(false);
</script>

<template>
    <tooltip-button
        tooltip="Save / Share"
        :icon="settings.isTouchDevice ? mdiShareVariant : mdiContentSave"
        @click="showShareDialog = true"
    />
    <div class="d-none">
        <save-share-dialog v-model="showShareDialog" />
    </div>
</template>
