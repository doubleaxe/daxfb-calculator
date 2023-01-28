<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
-->
<script setup lang="ts">
import type {RecipeIO} from '@/scripts/data/data';

const props = defineProps<{
    ioarray: RecipeIO[];
}>();

</script>

<template>
    <template
        v-for="(io, index) in props.ioarray"
        :key="index"
    >
        <icon-component :image="io.item.image" :data-tooltip="io.item.label" />
    </template>
</template>
