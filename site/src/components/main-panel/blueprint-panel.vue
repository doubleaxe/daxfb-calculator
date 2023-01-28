<script setup lang="ts">
import {ref, watch, computed, reactive} from 'vue';
import {injectBlueprintModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import RecipesMenu from './recipes-menu.vue';
import {syncRefs, unrefElement, useEventListener, type MaybeElement} from '@vueuse/core';
import {Rect} from '@/scripts/geometry';
import {useLeftPanelDragAndDrop, useLinkDragAndDrop} from '@/composables/drag-helpers';
import {useEventHook} from '@/composables';
import {injectFilter} from '@/scripts/filter';

const settings = injectSettings();
const filter = injectFilter();
const blueprintModel = injectBlueprintModel();
const blueprintsElement = ref<MaybeElement>(null);
const recipesMenuElement = ref<InstanceType<typeof RecipesMenu> | null>(null);

const {hooks: leftPanelHooks, dropZoneElem: dropZoneElem1} = useLeftPanelDragAndDrop();
const {dropZoneElem: dropZoneElem2} = useLinkDragAndDrop();
syncRefs(blueprintsElement, [dropZoneElem1, dropZoneElem2]);

useEventHook(leftPanelHooks.notifyDrop, (param) => {
    const item = reactive(blueprintModel.addItem(param.item.name));
    item.position = item.position.assignPoint(param.clientRect);
    if(filter.key) {
        const preselectRecipe = item.possibleRecipeForItem(filter.key, filter.direction);
        if(preselectRecipe)
            item.selectRecipe(preselectRecipe);
    }
});

const computedStyle = computed(() => {
    const {boundingRect} = blueprintModel;
    return {
        width: boundingRect.width ? `${boundingRect.width}px` : '100%',
        height: boundingRect.width ? `${boundingRect.height}px` : '100%',
        /* transform: `scale(${settings.scale})`, */
    };
});
const updateBlueprintOffsetPosition = (evt?: Event) => {
    const _blueprintsElement = unrefElement(blueprintsElement);
    if(!_blueprintsElement)
        return;
    if(evt && (evt.target instanceof HTMLElement)) {
        if(!(evt.target as HTMLElement).contains(_blueprintsElement))
            return;
    }
    blueprintModel.requestUpdateOffsetPosition();
};
useEventListener(window, ['scroll', 'resize'], updateBlueprintOffsetPosition, {capture: true, passive: true});
watch([blueprintsElement, () => settings.scale], () => updateBlueprintOffsetPosition());
blueprintModel.registerUpdateOffsetPosition(() => {
    const transformedRect = unrefElement(blueprintsElement)?.getBoundingClientRect();
    return Rect.assign(transformedRect);
});

</script>

<template>
    <div
        ref="blueprintsElement"
        class="blueprint-collection"
        :style="computedStyle"
        @pointerdown.left=""
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
