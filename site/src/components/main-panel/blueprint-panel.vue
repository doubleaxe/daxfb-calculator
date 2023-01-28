<script setup lang="ts">
import {ref, computed, reactive} from 'vue';
import {injectBlueprintModel, type BlueprintItemModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import RecipesMenu from './recipes-menu.vue';
import {syncRefs, useEventListener, type MaybeElement} from '@vueuse/core';
import {
    SelectedClassType,
    useDragAndScroll,
    useLeftPanelDragAndDrop,
    useLinkDragAndDrop,
    useOverflowScroll,
    usePointAndClick,
} from '@/composables/drag-helpers';
import {useEventHook} from '@/composables';
import {injectFilter} from '@/scripts/filter';
import type {ReadonlyPointType} from '@/scripts/geometry';
import type {Item} from '@/scripts/data/data';

const settings = injectSettings();
const filter = injectFilter();
const blueprintModel = injectBlueprintModel();
const blueprintsElement = ref<MaybeElement>(null);
const recipesMenuElement = ref<InstanceType<typeof RecipesMenu> | null>(null);
//detects if screen was scrolled between pointer down and click, don't perform anything if was scrolled
let wasScrolled = false;

const {onStart: startDragAndScroll} = useDragAndScroll();
useOverflowScroll(blueprintsElement);
const {hooks: leftPanelHooks, dropZoneElem: dropZoneElem1} = useLeftPanelDragAndDrop();
const {dropZoneElem: dropZoneElem2} = useLinkDragAndDrop();
const {processSelected, parentElem: dropZoneElem3, notifySelected} = usePointAndClick();
syncRefs(blueprintsElement, [dropZoneElem1, dropZoneElem2, dropZoneElem3]);

function addItem(selected: Item, clientPosition: ReadonlyPointType) {
    const item = reactive(blueprintModel.addItem(selected.name));
    item.position = item.position.assignPoint(clientPosition);
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
        addItem(param.item.item as Item, param.clientPosition);
        param.wasHandled();
        return;
    }
    if(param.item.clazz == SelectedClassType.BlueprintItemModel) {
        const item = param.item.item as BlueprintItemModel;
        item.position = item.position.assignPoint(param.clientPosition).positive();
        param.wasHandled();
        return;
    }
});

const computedStyle = computed(() => {
    const {boundingRect} = blueprintModel;
    return {
        width: boundingRect.width ? `${boundingRect.width}px` : '100%',
        height: boundingRect.width ? `${boundingRect.height}px` : '100%',
        transform: `scale(${settings.scale})`,
    };
});

useEventListener('scroll', () => { wasScrolled = true; }, {capture: true, passive: true});
</script>

<template>
    <div
        ref="blueprintsElement"
        class="blueprint-collection"
        :style="computedStyle"
        @pointerdown.left="startDragAndScroll($event); wasScrolled = false;"
        @click="processSelected($event)"
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
                :parent="blueprintsElement"
                @recipes-menu-activate="recipesMenuElement?.activate"
            />
        </template>
    </div>
</template>

<style scoped>
.blueprint-collection {
    position: relative;
    min-height: 100%;
    min-width: 100%;
    transform-origin: 0 0;
}
</style>
