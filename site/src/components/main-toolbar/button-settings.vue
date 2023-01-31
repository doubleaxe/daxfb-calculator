<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {ref} from 'vue';
import {mdiCog} from '@mdi/js';

const showSettingsDialog = ref(false);
</script>

<template>
    <tooltip-button
        tooltip="Settings"
        :icon="mdiCog"
        @click="showSettingsDialog = true"
    />
    <div class="d-none">
        <settings-dialog v-model="showSettingsDialog" />
    </div>
</template>
