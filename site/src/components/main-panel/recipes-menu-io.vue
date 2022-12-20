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
        <icon-component :image="io.item.image" />
    </template>
</template>
