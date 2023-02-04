<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose} from '@mdi/js';
import {useVModel} from '@vueuse/core';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);
</script>

<template>
    <v-dialog v-model="dialog" fullscreen>
        <v-sheet class="help-parent">
            <v-toolbar>
                <v-toolbar-title>Help</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <iframe class="help-iframe" src="https://doubleaxe.github.io/daxfb-calculator/" />
        </v-sheet>
    </v-dialog>
</template>

<style scoped>
.help-parent {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.help-iframe {
    width: 100%;
    flex-grow: 1;
    border: 0px;
}
</style>
