<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {GameRecipeIO} from '#types/game-data';

const props = defineProps<{
    ioarray: GameRecipeIO[];
}>();

</script>

<template>
    <template
        v-for="(io, index) in props.ioarray"
        :key="index"
    >
        <icon-component :image="io.product.image" :data-tooltip="io.product.label" />
    </template>
</template>
