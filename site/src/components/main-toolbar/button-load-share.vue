<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {ref} from 'vue';
import {mdiCloudDownload} from '@mdi/js';

const showShareDialog = ref(false);
</script>

<template>
    <tooltip-button tooltip="Load Shared" :icon="mdiCloudDownload" @click="showShareDialog = true" />
    <div class="d-none">
        <load-share-dialog v-model="showShareDialog" />
    </div>
</template>
