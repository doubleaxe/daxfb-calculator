<script setup lang="ts">
import type {BlueprintItemModel} from '@/scripts/model/store';
import {mdiChevronRight} from '@mdi/js';

const props = defineProps<{
    item: BlueprintItemModel;
    activator: string;
}>();

function selected({id: name}: {id: unknown}) {
    props.item.selectRecipe(name as string);
}
</script>

<template>
    <v-menu :activator="props.activator">
        <v-list density="compact" @click:select="selected">
            <optimized-tooltip>
                <v-list-item
                    v-for="(recipe, index) in props.item.recipes"
                    :key="index"
                    :value="recipe.name"
                    :active="(item.selectedRecipe?.name == recipe.name)"
                >
                    <v-list-item-title>
                        <div class="io-menu-item">
                            <recipes-menu-io :ioarray="recipe.input.filter((i) => !i.isResource)" />
                            <v-icon class="d-block" :icon="mdiChevronRight" />
                            <recipes-menu-io :ioarray="recipe.output.filter((i) => !i.isResource)" />
                        </div>
                    </v-list-item-title>
                </v-list-item>
            </optimized-tooltip>
        </v-list>
    </v-menu>
</template>

<style scoped>
.io-menu-item {
    display: flex;
    align-items: center;
}
</style>
