<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {ref, computed, reactive, watch, unref, nextTick} from 'vue';
import {injectBlueprintModel, type BlueprintItemModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import RecipesMenu from './recipes-menu.vue';
import {syncRefs, useEventListener, type MaybeElement} from '@vueuse/core';
import {
    getScrollBox,
    SelectedClassType,
    useDragAndScroll,
    useItemDragAndDrop,
    useLeftPanelDragAndDrop,
    useLinkDragAndDrop,
    useOverflowScroll,
    usePointAndClick,
} from '@/composables/drag-helpers';
import {useEventHook} from '@/composables';
import {injectFilter} from '@/scripts/filter';
import type {ReadonlyPointType} from '@/scripts/geometry';
import type {GameItem} from '#types/game-data';

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
const {hooks: itemHooks, dropZoneElem: dropZoneElem3} = useItemDragAndDrop();
const {processSelected, parentElem: dropZoneElem4, notifySelected} = usePointAndClick();
syncRefs(blueprintsElement, [dropZoneElem1, dropZoneElem2, dropZoneElem3, dropZoneElem4]);

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
        item.setRect(item.rect.assignPoint(param.clientPosition).limit(blueprintModel.boundingRect));
        param.wasHandled();
        return;
    }
});

useEventHook(itemHooks.notifyStart, (param) => {
    //there will be glitches, if we drag and expand and scroll simultaneously
    blueprintModel.freezeBoundingRect(true);
});
useEventHook(itemHooks.notifyDrop, (param) => {
    //there will be glitches, if we drag and expand and scroll simultaneously
    blueprintModel.freezeBoundingRect(false);
});
useEventHook([itemHooks.notifyMove, itemHooks.notifyDrop], (param) => {
    const item = param.item;
    item.setRect(item.rect.assignPoint(param.clientRect).limit(blueprintModel.boundingRect));
});

const transform = reactive<Record<string, string>>({});
const backgroundStyle = ref<Record<string, string>>({});
const transformStyle = computed(() => {
    const _transform: Record<string, string> = {
        ...unref(transform),
        scale: String(settings.scale),
    };
    return {
        transform: Object.entries(_transform).map(([key, value]) => `${key}(${value})`).join(' '),
    };
});
const computedStyle = computed(() => {
    return {
        ...unref(backgroundStyle),
    };
});

watch(() => blueprintModel.boundingRect, (value, oldValue) => {
    const {boundingRect} = blueprintModel;
    //first update bounding rect and adjusting translate, so scrollbar may appear
    backgroundStyle.value = {
        left: `${boundingRect.x}px`,
        top: `${boundingRect.y}px`,
        width: `${boundingRect.width}px`,
        height: `${boundingRect.height}px`,
    };
    if((value.x !== oldValue.x) || (value.y !== oldValue.y)) {
        transform.translateX = `${Math.max(-value.x, 0)}px`;
        transform.translateY = `${Math.max(-value.y, 0)}px`;
        //adjusting scrolling the same amount, so screen is left on the same position
        const keepScrollPosition = (scrollboxElement?: HTMLElement | null) => {
            if(!scrollboxElement) {
                scrollboxElement = getScrollBox(blueprintsElement)?.scrollboxElement;
            }
            if(!scrollboxElement) {
                return;
            }
            const deltaX = value.x - oldValue.x;
            const deltaY = value.y - oldValue.y;
            const scrollX = scrollboxElement.scrollLeft - deltaX;
            const scrollY = scrollboxElement.scrollTop - deltaY;
            if(scrollX >= 0)
                scrollboxElement.scrollLeft = scrollX;
            if(scrollY >= 0)
                scrollboxElement.scrollTop = scrollY;
        };
        const scrollboxElement = getScrollBox(blueprintsElement)?.scrollboxElement;
        if(scrollboxElement) {
            keepScrollPosition(scrollboxElement);
        } else {
            nextTick(keepScrollPosition);
        }
    }
});

useEventListener('scroll', () => { wasScrolled = true; }, {capture: true, passive: true});
</script>

<template>
    <div class="flexible-scroll-origin" :style="transformStyle">
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
    </div>
</template>

<style scoped>
.flexible-scroll-origin {
    height: 100%;
    width: 100%;
    transform-origin: 0 0;
}
.blueprint-collection {
    position: relative;
    transform-origin: 0 0;
}
</style>
