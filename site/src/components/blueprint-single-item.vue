<script setup lang="ts">
import {ref, unref, computed} from 'vue';
import type {ItemModel} from '../scripts/blueprint-model';
import {mdiChevronRight} from '@mdi/js';
import {useElementHover} from '@vueuse/core';

const props = defineProps<{
    item: ItemModel;
}>();
const mainDiv = ref<HTMLElement | null>(null);
const item = computed(() => props.item.item);
const recipe = computed(() => unref(item)?.recipes?.firstRecipe);
const isHovered = useElementHover(mainDiv);
</script>

<template>
    <div ref="mainDiv" class="main-row rounded bg-grey-lighten-4" :class="`elevation-${isHovered ? 2 : 0}`">
        <div>
            <icon-component
                v-for="io in recipe?.input"
                :key="io.item.name"
                class="icon-row"
                :image="io.item.image"
            />
        </div>
        <v-icon v-if="recipe?.input.length" class="align-self-center" :icon="mdiChevronRight" />
        <div class="align-self-center">
            <icon-component class="icon-row" :image="item?.image" />
        </div>
        <v-icon v-if="recipe?.output.length" class="align-self-center" :icon="mdiChevronRight" />
        <div>
            <icon-component
                v-for="io in recipe?.output"
                :key="io.item.name"
                class="icon-row"
                :image="io.item.image"
            />
        </div>
    </div>
</template>

<style scoped>
.main-row {
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    align-items: start;
}
.icon-row {
    display: block;
}
</style>
