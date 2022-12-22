<script setup lang="ts">
import {ref, unref, computed, onMounted, watch, nextTick} from 'vue';
import type {BlueprintItemModel, RecipeIOModel} from '@/scripts/model/store';
import {mdiChevronRight} from '@mdi/js';
import {useElementHover} from '@vueuse/core';
import {injectSettings} from '@/scripts/settings';
import {Rect} from '@/scripts/geometry';

const props = defineProps<{
    item: BlueprintItemModel;
}>();
const emit = defineEmits<{
    (e: 'link-drag-begin', item?: RecipeIOModel): void;
    (e: 'link-drag-force'): void;
}>();

const settings = injectSettings();
const mainDivElement = ref<HTMLElement | null>(null);
const recipe = computed(() => props.item?.selectedRecipe);
const itemStateColor = computed(() => settings.itemStateColor[props.item.state]);
const itemId = `blueprint-item-${props.item?.key || ''}`;
const isHovered = useElementHover(mainDivElement);
const computedElevation = computed(() => {
    if(props.item.isFloating)
        return settings.draggingElevation;
    if(unref(isHovered))
        return settings.hoveringElevation;
    return 0;
});

const updateSize = () => {
    nextTick(() => {
        const mainDiv = unref(mainDivElement);
        const _item = props.item;
        const _recipe = unref(recipe);
        if(!mainDiv || !_item || !_recipe)
            return;
        const mainDivRect = mainDiv.getBoundingClientRect();
        _item.rect.assignSize(mainDivRect);
        const ioList = mainDiv.querySelectorAll('[data-io-id]');
        for(let i = 0; i < ioList.length; i++) {
            const ioElement = ioList.item(i);
            const key = ioElement.getAttribute('data-io-id') || '';
            const io = _recipe.itemByKey(key);
            const ioRect = ioElement.getBoundingClientRect();
            io?.rect.assignRect(new Rect(ioRect).offsetBy(mainDivRect, -1));
        }
    });
};
onMounted(updateSize);
watch(recipe, updateSize);
</script>

<template>
    <div
        ref="mainDivElement"
        class="rounded parent-div"
        :class="[`elevation-${computedElevation}`, itemStateColor]"
        :data-item-id="props.item.key"
    >
        <div class="bg-primary title-row">
            <div class="title-text text-caption">
                {{ item.label }}
            </div>
        </div>
        <div class="main-row">
            <div>
                <template v-for="io in recipe?.input" :key="io.key">
                    <blueprint-single-io
                        :data-io-id="io.key"
                        :io="io"
                        @link-drag-begin="(_io?: RecipeIOModel) => emit('link-drag-begin', _io)"
                    />
                </template>
            </div>
            <v-icon v-if="recipe?.inputCount" class="align-self-center" :icon="mdiChevronRight" />
            <div class="align-self-center">
                <v-hover v-slot="{isHovering, props: props0}">
                    <icon-component-tooltip
                        :id="itemId"
                        v-bind="props0"
                        :class="`elevation-${isHovering ? settings.hoveringElevation : 0}`"
                        class="main-icon-row rounded"
                        :image="props.item?.image"
                        :tooltip="props.item?.label"
                        @pointerdown.stop=""
                        @pointerup.stop=""
                    />
                </v-hover>
                <recipes-menu :activator="`#${itemId}`" :item="props.item" />
            </div>
            <v-icon v-if="recipe?.outputCount" class="align-self-center" :icon="mdiChevronRight" />
            <div>
                <template v-for="io in recipe?.output" :key="io.key">
                    <blueprint-single-io
                        :data-io-id="io.key"
                        :io="io"
                        @link-drag-begin="(_io?: RecipeIOModel) => emit('link-drag-begin', _io)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.parent-div {
    user-select: none;
}
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
.main-icon-row {
    display: block;
}
</style>
