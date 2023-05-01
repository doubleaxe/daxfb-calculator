<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {useVModel} from '@vueuse/core';
import {knownLayoutAlgorithms, LayoutType} from '@/scripts/graph';

const props = defineProps<{
    modelValue: string;
}>();
const emit = defineEmits(['update:modelValue']);
const selectedAlgorithm = useVModel(props, 'modelValue', emit);
</script>

<template>
    <v-select
        v-model="selectedAlgorithm"
        :items="knownLayoutAlgorithms(LayoutType.DAGRE).algorithms"
        label="Dagre layout algorithm"
        density="compact"
    >
        <template #details>
            Default - {{ knownLayoutAlgorithms(LayoutType.DAGRE).default }}, see&nbsp;
            <a href="https://github.com/dagrejs/dagre/wiki" target="_blank">https://github.com/dagrejs/dagre/wiki</a>.
        </template>
    </v-select>
</template>
