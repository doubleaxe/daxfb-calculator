<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {ref} from 'vue';
import {mdiLinkVariantPlus} from '@mdi/js';

const showGenerateLinkDialog = ref(false);
</script>

<template>
    <tooltip-button
        tooltip="Generate Link"
        :icon="mdiLinkVariantPlus"
        @click="showGenerateLinkDialog = true"
    />
    <div class="d-none">
        <generate-link-dialog v-model="showGenerateLinkDialog" />
    </div>
</template>
