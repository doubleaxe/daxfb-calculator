<script setup lang="ts">
import {useLeftPanelDragAndDrop} from '@/composables/drag-helpers';
import type {Item} from '@/scripts/data/data';
import {injectFilter} from '@/scripts/filter';
import {injectHtmlHelpers} from '@/scripts/html-drag-helpers';
import {ClassType} from '@/scripts/types';

const {dragStart} = useLeftPanelDragAndDrop();

const filter = injectFilter();
const htmlHelpers = injectHtmlHelpers();

function itemClass(item: Item) {
    const selected = htmlHelpers.pointAndClickImpl.selectedObject;
    if((selected?.type == ClassType.Item) && (selected === item))
        return ['selected-border'];
    return [];
}
</script>

<template>
    <div>
        <icon-list-filter />
        <div class="icon-div-parent">
            <optimized-tooltip>
                <template v-for="(group, _index1) in filter.buildFilter()" :key="_index1">
                    <v-divider v-if="_index1" />
                    <template v-for="item in group" :key="item.name">
                        <icon-component
                            class="rounded icon-div hover-elevation"
                            :class="itemClass(item)"
                            :image="item.image"
                            :data-tooltip="item.label"
                            @pointerdown.left="dragStart($event, item)"
                        />
                    </template>
                </template>
            </optimized-tooltip>
        </div>
    </div>
</template>

<style scoped>
.icon-div-parent {
    line-height: 0px;
    font-size: 0px;
    user-select: none;
}
.icon-div {
    display: inline-block;
}
.icon-draggable {
    position: fixed;
    z-index: 5000;
}
</style>
