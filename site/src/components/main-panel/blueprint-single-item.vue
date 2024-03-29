<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {ref, unref, computed, onMounted, watch, nextTick} from 'vue';
import {injectBlueprintModel, type BlueprintItemModel, type RecipeIOModel} from '@/scripts/model/store';
import {mdiCursorMove, mdiTransferDown, mdiTransferUp} from '@mdi/js';
import {useElementHover, type MaybeElement} from '@vueuse/core';
import {injectSettings} from '@/scripts/settings';
import {Rect, type ReadonlyRectType} from '@/scripts/geometry';
import {SelectedClassType, screenToClient, useItemDragAndDrop, usePointAndClick} from '@/composables/drag-helpers';
import {useEventHook} from '@/composables';

const props = defineProps<{
    item: BlueprintItemModel;
    parent: MaybeElement;
}>();
const emit = defineEmits<{
    (e: 'recipes-menu-activate', item: BlueprintItemModel, activator: Element): void;
}>();

const settings = injectSettings();
const blueprintModel = injectBlueprintModel();
const mainDivElement = ref<HTMLElement | null>(null);
//separate state, because useItemDragAndDrop is shared between all items
const isDragging = ref(false);
const itemStateColor = computed(() => settings.itemStateColor[props.item.state]);
const isHovered = useElementHover(mainDivElement);
const {hooks: itemHooks, dragStart} = useItemDragAndDrop();
const {selectItem, selectedItem} = usePointAndClick();

useEventHook([itemHooks.notifyCancel, itemHooks.notifyDrop], () => {
    isDragging.value = false;
});

const computedElevation = computed(() => {
    if(unref(isDragging))
        return 'dragging-elevation-static';
    if(unref(isHovered))
        return 'hover-elevation-static';
    return 0;
});

const computeStyle = computed(() => {
    return {
        left: `${props.item.rect.x}px`,
        top: `${props.item.rect.y}px`,
    };
});

const computedSelectedClass = computed(() => {
    if(unref(selectedItem)?.isSelected(props.item))
        return 'selected-border';
    return 'unselected-border';
});

function updateIoRects() {
    nextTick(() => {
        const mainDiv = unref(mainDivElement);
        const _recipe = props.item?.selectedRecipe;
        if(!mainDiv || !_recipe)
            return;

        const mainDivrect: ReadonlyRectType = screenToClient(props.parent, mainDiv.getBoundingClientRect(), settings.scale);
        props.item.setRect(props.item.rect.assignSize(mainDivrect));
        props.item.initializationCompleted();

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

        ioList.forEach((io, index) => { io.setRect(ioClientRects[index] || Rect.assign()); });
    });
}

const leftSide = computed(() => {
    const _recipe = props.item?.selectedRecipe;
    const io = (props.item.isFlipped ? _recipe?.visibleOutput() : _recipe?.visibleInput()) || [];
    return {
        io: () => io,
        count: io.length,
    };
});
const rightSide = computed(() => {
    const _recipe = props.item?.selectedRecipe;
    const io = (props.item.isFlipped ? _recipe?.visibleInput() : _recipe?.visibleOutput()) || [];
    return {
        io: () => io,
        count: io.length,
    };
});

onMounted(updateIoRects);
watch([
    () => props.item.selectedRecipe,
    () => props.item.isFlipped,
    () => props.item.linksGenerationNumber,
], updateIoRects);
watch(() => props.item.rect, (value, oldValue) => {
    //size is updated by function updateIoRects
    if((value.x !== oldValue.x) || (value.y !== oldValue.y)) {
        updateIoRects();
    }
});
</script>

<template>
    <div
        ref="mainDivElement"
        class="rounded parent-div"
        :class="[computedElevation, itemStateColor, computedSelectedClass]"
        :style="computeStyle"
        :data-item-id="props.item.key"
        @pointerdown.left.stop="dragStart($event, props.item); isDragging = true;"
    >
        <div class="bg-primary title-row">
            <div class="title-text text-caption">
                {{ props.item.label }}
            </div>
            <div class="float-right mr-1">
                <item-menu-button :item="props.item" />
            </div>
            <div v-if="settings.pointAndClickEnabled" class="float-right mr-1">
                <v-btn
                    size="x-small"
                    color="secondary"
                    variant="flat"
                    @pointerdown.left.stop
                    @click.stop="selectItem(SelectedClassType.BlueprintItemModel, props.item)"
                >
                    <v-icon :icon="mdiCursorMove" />
                </v-btn>
            </div>
            <div v-if="blueprintModel.isUpgradeMode && props.item.isUpgradable()" class="float-right mr-1">
                <v-btn
                    size="x-small"
                    color="secondary"
                    variant="flat"
                    rounded="0"
                    :disabled="!props.item.isUpgradable(1)"
                    @pointerdown.left.stop
                    @click.stop="props.item.upgrade(1)"
                >
                    <v-icon :icon="mdiTransferUp" />
                </v-btn>
                <v-btn
                    size="x-small"
                    color="secondary"
                    variant="flat"
                    rounded="0"
                    :disabled="!props.item.isUpgradable(-1)"
                    @pointerdown.left.stop
                    @click.stop="props.item.upgrade(-1)"
                >
                    <v-icon :icon="mdiTransferDown" />
                </v-btn>
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
            <blueprint-single-factory
                :item="props.item"
                @recipes-menu-activate="(activator: Element) => emit('recipes-menu-activate', props.item, activator)"
            />
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
    touch-action: none;
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
</style>
