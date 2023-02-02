<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiHelpCircle} from '@mdi/js';

const props = defineProps<{
    isMenu?: boolean;
}>();
//if menu is closed - this component is destroyed, so we need to keep dialog somewhere else
const emit = defineEmits<{
    (e: 'show-dialog'): void;
}>();
</script>

<template>
    <tooltip-button
        v-if="!props.isMenu"
        tooltip="Help"
        :icon="mdiHelpCircle"
        @click="emit('show-dialog')"
    />
    <v-list-item
        v-if="props.isMenu"
        :prepend-icon="mdiHelpCircle"
        title="Help"
        @click="emit('show-dialog')"
    />
</template>
