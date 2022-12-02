<script setup lang="ts">
import {unref, computed} from 'vue';
import type {ItemModel} from '../scripts/blueprint-model';

const props = defineProps<{
    item: ItemModel;
}>();
const item = computed(() => props.item.item);
const recipe = computed(() => unref(item)?.recipes?.firstRecipe);
</script>

<template>
    <div>
        <div class="column">
            <icon-component
                v-for="io in recipe?.input"
                :key="io.item.name"
                class="row"
                :image="io.item.image"
            />
        </div>
        <div class="column">
            <icon-component :image="item?.image" />
        </div>
        <div class="column">
            <icon-component
                v-for="io in recipe?.output"
                :key="io.item.name"
                class="row"
                :image="io.item.image"
            />
        </div>
    </div>
</template>

<style scoped>
.column {
    display: inline-block;
}
.row {
    display: block;
}
</style>
