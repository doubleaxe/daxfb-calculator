<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {ref, computed, reactive, unref, watch, onMounted} from 'vue';
import {injectBlueprintModel, type BlueprintItemModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import RecipesMenu from './recipes-menu.vue';
import {syncRefs, useEventListener, type MaybeElement} from '@vueuse/core';
import {
    SelectedClassType,
    useDragAndScroll,
    useItemDragAndDrop,
    useLeftPanelDragAndDrop,
    useLinkDragAndDrop,
    useOverflowScroll,
    usePointAndClick,
    useSharedBlueprintSurface,
} from '@/composables/drag-helpers';
import {useEventHook} from '@/composables';
import {injectFilter} from '@/scripts/filter';
import type {ReadonlyPointType} from '@/scripts/geometry';
import type {GameItem} from '#types/game-data';
import {buildTransformStyle} from '@/scripts/util';

const settings = injectSettings();
const filter = injectFilter();
const blueprintModel = injectBlueprintModel();
const blueprintSurface = ref<MaybeElement>(null);
const blueprintCollection = ref<MaybeElement>(null);
const recipesMenuElement = ref<InstanceType<typeof RecipesMenu> | null>(null);
//detects if screen was scrolled between pointer down and click, don't perform anything if was scrolled
let wasScrolled = false;

const {onStart: startDragAndScroll} = useDragAndScroll();
useOverflowScroll(blueprintSurface);
const {
    hooks: leftPanelHooks,
    dropZoneSurfaceElem: dropZoneSurfaceElem1,
    dropZoneOriginElem: dropZoneOriginElem1,
} = useLeftPanelDragAndDrop();
const {dropZoneSurfaceElem: dropZoneSurfaceElem2, dropZoneOriginElem: dropZoneOriginElem2} = useLinkDragAndDrop();
const {
    hooks: itemHooks,
    dropZoneSurfaceElem: dropZoneSurfaceElem3,
    dropZoneOriginElem: dropZoneOriginElem3,
} = useItemDragAndDrop();
const {processSelected, parentElem: dropZoneOriginElem4, notifySelected} = usePointAndClick();
const {surfaceElem, originElem, updateSurface, boundingRect} = useSharedBlueprintSurface();

syncRefs(blueprintSurface, [surfaceElem, dropZoneSurfaceElem1, dropZoneSurfaceElem2, dropZoneSurfaceElem3]);
syncRefs(blueprintCollection, [originElem, dropZoneOriginElem1, dropZoneOriginElem2, dropZoneOriginElem3, dropZoneOriginElem4]);

function addItem(selected: GameItem, clientPosition: ReadonlyPointType) {
    const item = reactive(blueprintModel.addItem(selected.name));
    item.setRect(item.rect.assignPoint(clientPosition));
    if(filter.key) {
        const preselectRecipe = item.possibleRecipeForItem(filter.key, filter.direction);
        if(preselectRecipe)
            item.selectRecipe(preselectRecipe);
    }
}
useEventHook(leftPanelHooks.notifyDrop, (param) => addItem(param.item, param.clientRect));

useEventHook(notifySelected, (param) => {
    if(wasScrolled) {
        return;
    }
    if(param.item.clazz == SelectedClassType.Item) {
        addItem(param.item.item as GameItem, param.clientPosition);
        param.wasHandled();
        return;
    }
    if(param.item.clazz == SelectedClassType.BlueprintItemModel) {
        const item = param.item.item as BlueprintItemModel;
        item.setRect(item.rect.assignPoint(param.clientPosition).limit(unref(boundingRect)));
        param.wasHandled();
        return;
    }
});

useEventHook([itemHooks.notifyMove, itemHooks.notifyDrop], (param) => {
    const item = param.item;
    item.setRect(item.rect.assignPoint(param.clientRect).limit(unref(boundingRect)));
    if(param.event == 'notifyDrop') {
        updateSurface(blueprintModel.items);
    }
});

const scaleStyle = computed(() => {
    return {
        transform: buildTransformStyle({scale: String(settings.scale)}),
    };
});

watch([() => blueprintModel.itemsGenerationNumber, () => settings.scale], () => {
    //on blueprint load reset scroll position
    const resetScroll = !blueprintModel.itemsGenerationNumber;
    updateSurface(blueprintModel.items, resetScroll);
});

function handleScale(event: WheelEvent) {
    if(settings.scrollScaleEnabled) {
        if(event.deltaY < 0) {
            settings.scale = Math.min(settings.scale + 0.1, 2);
        } else {
            settings.scale = Math.max(settings.scale - 0.1, 0.5);
        }
        event.stopPropagation();
        event.preventDefault();
    }
}

useEventListener('scroll', () => { wasScrolled = true; }, {capture: true, passive: true});
onMounted(() => {
    updateSurface(blueprintModel.items);
});
</script>

<template>
    <div
        ref="blueprintSurface"
        class="blueprint-surface"
        @pointerdown.left="startDragAndScroll($event); wasScrolled = false;"
        @click="processSelected($event)"
        @wheel="handleScale"
    >
        <div
            ref="blueprintCollection"
            class="blueprint-collection"
            :style="scaleStyle"
        >
            <link-draggable />
            <recipes-menu ref="recipesMenuElement" />
            <blueprint-links />
            <template
                v-for="item in blueprintModel.items"
                :key="item.key"
            >
                <blueprint-single-item
                    :item="item"
                    :parent="blueprintCollection"
                    @recipes-menu-activate="recipesMenuElement?.activate"
                />
            </template>
        </div>
    </div>
</template>

<style scoped>
.blueprint-surface {
    transform-origin: 0 0;
    min-width: 100%;
    min-height: 100%;
    /* border: 1px solid red; */
}
.blueprint-collection {
    transform-origin: 0 0;
    position: relative;
    overflow: visible;
    /* border: 1px solid green; */
}
</style>
