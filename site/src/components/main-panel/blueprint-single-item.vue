<script setup lang="ts">
import {ref, unref, computed, onMounted, watch, nextTick, watchEffect} from 'vue';
import type {BlueprintItemModel, RecipeIOModel} from '@/scripts/model/store';
import {mdiArrowLeft, mdiArrowRight} from '@mdi/js';
import {useElementHover, type MaybeElement} from '@vueuse/core';
import {injectSettings} from '@/scripts/settings';
import {Rect, type ReadonlyRectType} from '@/scripts/geometry';
import {screenToClient, useItemDragAndDrop} from '@/composables/drag-helpers';
import {useEventHook} from '@/composables';

const props = defineProps<{
    item: BlueprintItemModel;
    parent: MaybeElement;
}>();
const emit = defineEmits<{
    (e: 'recipes-menu-activate', item: BlueprintItemModel, activator: Element): void;
}>();

const settings = injectSettings();
const mainDivElement = ref<HTMLElement | null>(null);
const itemStateColor = computed(() => settings.itemStateColor[props.item.state]);
const isHovered = useElementHover(mainDivElement);
const {dragStart, isDragging, hooks, dropZoneElem} = useItemDragAndDrop();

watchEffect(() => { dropZoneElem.value = props.parent; });

const computedElevation = computed(() => {
    if(unref(isDragging))
        return 'dragging-elevation-static';
    if(unref(isHovered))
        return 'hover-elevation-static';
    return 0;
});

const computeStyle = computed(() => {
    return {
        left: `${props.item.position.x}px`,
        top: `${props.item.position.y}px`,
    };
});

function updateIoRects() {
    nextTick(() => {
        const mainDiv = unref(mainDivElement);
        const _recipe = props.item?.selectedRecipe;
        if(!mainDiv || !_recipe)
            return;
        const ioElements = mainDiv.querySelectorAll('[data-io-id]');
        const ioScreenRects: ReadonlyRectType[] = [];
        const ioList: RecipeIOModel[] = [];
        for(let i = 0; i < ioElements.length; i++) {
            const ioElement = ioElements.item(i);
            const key = ioElement.getAttribute('data-io-id') || '';
            const io = _recipe.itemByKey(key);
            if(io) {
                ioScreenRects.push(ioElement.getBoundingClientRect());
                ioList.push(io);
            }
        }
        const ioClientRects = screenToClient(props.parent, ioScreenRects, settings.scale);

        ioList.forEach((io, index) => { io.rect = ioClientRects[index] || Rect.assign(); });
    });
}

useEventHook([hooks.notifyMove, hooks.notifyDrop], (param) => {
    const item = props.item;
    item.position = item.position.assignPoint(param.clientRect).positive();
    updateIoRects();
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

onMounted(updateIoRects);
watch([
    () => props.item.selectedRecipe,
    () => props.item.isFlipped,
], updateIoRects);
</script>

<template>
    <div
        ref="mainDivElement"
        class="rounded parent-div"
        :class="[computedElevation, itemStateColor]"
        :style="computeStyle"
        :data-item-id="props.item.key"
        @pointerdown.left.stop="dragStart($event, props.item)"
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
                        :io="io"
                        @text-update="updateIoRects"
                    />
                </template>
            </div>
            <div class="align-self-center d-flex flex-column align-center" @pointerdown.left.stop>
                <icon-component
                    class="main-icon-row rounded hover-border"
                    :image="props.item?.image"
                    :tooltip="props.item?.label"
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
                        :io="io"
                        @text-update="updateIoRects"
                    />
                </template>
            </div>
        </div>
        <blueprint-single-item-status :item="props.item" />
    </div>
</template>

<style scoped>
.parent-div {
    position: absolute;
    user-select: none;
}
.title-row {
    display: block;
    position: relative;
    height: 1.7rem;
    overflow: hidden;
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
