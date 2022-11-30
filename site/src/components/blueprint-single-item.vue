<script setup lang="ts">
import {unref, computed} from 'vue';
import type {ItemModel} from '../scripts/blueprint-model';

const props = defineProps<{
    item: ItemModel
}>();
const producer = computed(() => props.item.asProducer);
const recipe = computed(() => unref(producer)?.recipes?.firstRecipe);
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
            <icon-component :image="producer?.image" />
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
