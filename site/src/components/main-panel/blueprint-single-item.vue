<script setup lang="ts">
import {ref, unref, computed, onMounted, watch, nextTick} from 'vue';
import type {BlueprintItemModel, RecipeIOModel} from '@/scripts/model/store';
import {mdiArrowLeft, mdiArrowRight, mdiSync, mdiLock} from '@mdi/js';
import {useElementHover} from '@vueuse/core';
import {injectSettings} from '@/scripts/settings';
import {Rect} from '@/scripts/geometry';
import {formatNumber} from '@/scripts/format';

const props = defineProps<{
    item: BlueprintItemModel;
}>();
const emit = defineEmits<{
    (e: 'link-drag-begin', item?: RecipeIOModel): void;
    (e: 'link-drag-force'): void;
    (e: 'recipes-menu-activate', item: BlueprintItemModel, activator: Element): void;
}>();

const __DEBUG__ = import.meta.env.DEV;
const settings = injectSettings();
const mainDivElement = ref<HTMLElement | null>(null);
const itemStateColor = computed(() => settings.itemStateColor[props.item.state]);
const isHovered = useElementHover(mainDivElement);
const computedElevation = computed(() => {
    if(props.item.isFloating)
        return 'dragging-elevation-static';
    if(unref(isHovered))
        return 'hover-elevation-static';
    return 0;
});
const leftSide = computed(() => {
    const _recipe = props.item?.selectedRecipe;
    return props.item.isFlipped ? {
        io: () => _recipe?.output,
        count: _recipe?.outputCount,
    } : {
        io: () => _recipe?.input,
        count: _recipe?.inputCount,
    };
});
const rightSide = computed(() => {
    const _recipe = props.item?.selectedRecipe;
    return props.item.isFlipped ? {
        io: () => _recipe?.input,
        count: _recipe?.inputCount,
    } : {
        io: () => _recipe?.output,
        count: _recipe?.outputCount,
    };
});
const icon = computed(() => (props.item.isFlipped ? mdiArrowLeft : mdiArrowRight));
function flip() {
    // eslint-disable-next-line vue/no-mutating-props
    props.item.isFlipped = !props.item.isFlipped;
}

const updateSize = () => {
    nextTick(() => {
        const mainDiv = unref(mainDivElement);
        const _item = props.item;
        const _recipe = props.item?.selectedRecipe;
        if(!mainDiv || !_item || !_recipe)
            return;
        const mainDivRect = Rect.assign(mainDiv.getBoundingClientRect());
        _item.rect = _item.rect.assignSize(mainDivRect);
        const ioList = mainDiv.querySelectorAll('[data-io-id]');
        for(let i = 0; i < ioList.length; i++) {
            const ioElement = ioList.item(i);
            const key = ioElement.getAttribute('data-io-id') || '';
            const io = _recipe.itemByKey(key);
            const ioRect = ioElement.getBoundingClientRect();
            if(io) {
                io.rect = Rect.assign(ioRect).offsetBy(mainDivRect, -1);
            }
        }
    });
};
onMounted(updateSize);
watch([
    () => props.item.selectedRecipe,
    () => props.item.isFlipped,
    () => settings.scale,
], updateSize);
</script>

<template>
    <div
        ref="mainDivElement"
        class="rounded parent-div"
        :class="[computedElevation, itemStateColor]"
        :data-item-id="props.item.key"
    >
        <div class="bg-primary title-row">
            <div class="title-text text-caption">
                {{ props.item.label }}
            </div>
            <div class="float-right mr-1">
                <item-menu-button :item="props.item" />
            </div>
        </div>
        <div class="main-row">
            <div>
                <template v-for="io in leftSide.io()" :key="io.key">
                    <blueprint-single-io
                        :data-io-id="io.key"
                        :io="io"
                        @link-drag-begin="(_io?: RecipeIOModel) => emit('link-drag-begin', _io)"
                        @text-update="updateSize"
                    />
                </template>
            </div>
            <div class="align-self-center d-flex flex-column align-center">
                <icon-component
                    class="main-icon-row rounded hover-border"
                    :image="props.item?.image"
                    :tooltip="props.item?.label"
                    @pointerdown.left.stop
                    @click="emit('recipes-menu-activate', props.item, $event.currentTarget)"
                />
                <v-btn
                    variant="outlined"
                    rounded="pill"
                    size="x-small"
                    @click="flip"
                >
                    <v-icon class="align-self-center" :icon="icon" />
                </v-btn>
            </div>
            <div>
                <template v-for="io in rightSide.io()" :key="io.key">
                    <blueprint-single-io
                        :data-io-id="io.key"
                        :io="io"
                        @link-drag-begin="(_io?: RecipeIOModel) => emit('link-drag-begin', _io)"
                        @text-update="updateSize"
                    />
                </template>
            </div>
        </div>
        <div class="status-row bg-window-statusbar">
            <div class="title-text text-caption">
                <template v-if="props.item.isLocked">
                    <v-icon :icon="mdiLock" />
                </template>
                <template v-if="props.item.partOfCycle">
                    <v-icon :icon="mdiSync" color="warning" />
                </template>
                <template v-if="(props.item.solvedCount !== undefined)">
                    {{ (props.item.count ? formatNumber((props.item.solvedCount * 100) / props.item.count) : '0') + '%' }}
                    {{ formatNumber(props.item.solvedCount) + ' / ' }}
                </template>
                {{ formatNumber(props.item.count) }}
            </div>
            <div v-if="__DEBUG__" class="float-right mr-1 text-caption">
                {{ props.item.key }}
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
    height: 1.7rem;
    overflow: hidden;
}
.status-row {
    display: block;
    position: relative;
    height: 1.2rem;
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
