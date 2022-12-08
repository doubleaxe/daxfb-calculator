<script setup lang="ts">
import {ref, unref, computed} from 'vue';
import type {BlueprintItemModel, ItemModel, RecipeIOModel} from '../../scripts/model/store';
import {mdiChevronRight} from '@mdi/js';
import {useElementHover} from '@vueuse/core';

const props = defineProps<{
    item: BlueprintItemModel;
}>();
const emit = defineEmits<{
    (e: 'item-drag-begin', component?: HTMLElement, item?: ItemModel): void;
    (e: 'link-drag-begin', item?: RecipeIOModel): void;
}>();

const mainDiv = ref<HTMLElement | null>(null);
const recipe = computed(() => unref(props.item)?.selectedRecipe);
const isHovered = useElementHover(mainDiv);
</script>

<template>
    <div
        ref="mainDiv"
        class="rounded bg-grey-lighten-4"
        :class="`elevation-${isHovered ? 2 : 0}`"
    >
        <div class="bg-primary title-row">
            <div class="title-text text-caption">
                {{ item.label }}
            </div>
        </div>
        <div class="main-row">
            <div>
                <template v-for="io in recipe?.input" :key="io.name">
                    <v-hover v-slot="{isHovering, props: props0}">
                        <icon-component
                            v-bind="props0"
                            :class="`elevation-${isHovering ? 5 : 0}`"
                            class="icon-row rounded"
                            :image="io.image"
                            @pointerdown.stop="emit('link-drag-begin', io)"
                            @pointerup.stop="emit('link-drag-begin')"
                        />
                    </v-hover>
                </template>
            </div>
            <v-icon v-if="recipe?.input.length" class="align-self-center" :icon="mdiChevronRight" />
            <div class="align-self-center">
                <v-hover v-slot="{isHovering, props: props0}">
                    <icon-component
                        v-bind="props0"
                        :class="`elevation-${isHovering ? 5 : 0}`"
                        class="icon-row rounded"
                        :image="props.item?.image"
                        @pointerdown.stop=""
                        @pointerup.stop=""
                    />
                </v-hover>
            </div>
            <v-icon v-if="recipe?.output.length" class="align-self-center" :icon="mdiChevronRight" />
            <div>
                <template v-for="io in recipe?.output" :key="io.name">
                    <v-hover v-slot="{isHovering, props: props0}">
                        <icon-component
                            v-bind="props0"
                            :class="`elevation-${isHovering ? 5 : 0}`"
                            class="icon-row rounded"
                            :image="io.image"
                            @pointerdown.stop="emit('link-drag-begin', io)"
                            @pointerup.stop="emit('link-drag-begin')"
                        />
                    </v-hover>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.title-row {
    display: block;
    position: relative;
    height: 1.5rem;
    overflow: hidden;
}
.title-text {
    position: absolute;
    white-space: nowrap;
    padding-left: 4px;
    user-select: none;
}
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
