<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {GameItem} from '#types/game-data';
import {SelectedClassType, useLeftPanelDragAndDrop, usePointAndClick} from '@/composables/drag-helpers';
import {injectFilter} from '@/scripts/filter';
import {unref} from 'vue';

const {dragStart} = useLeftPanelDragAndDrop();
const {selectedItem, selectItem} = usePointAndClick();

const filter = injectFilter();

function computedItemClass(item: GameItem) {
    if(unref(selectedItem)?.isSelected(item))
        return ['selected-border'];
    return [];
}
</script>

<template>
    <div>
        <icon-list-filter />
        <div class="icon-div-parent bg-window-idle">
            <optimized-tooltip>
                <template v-for="(group, _index1) in filter.buildFilter()" :key="_index1">
                    <v-divider v-if="_index1" />
                    <template v-for="item in group" :key="item.name">
                        <icon-component
                            class="rounded icon-div hover-elevation"
                            :class="computedItemClass(item)"
                            :image="item.image"
                            :data-tooltip="item.label"
                            @pointerdown.left="dragStart($event, item)"
                            @click="selectItem(SelectedClassType.Item, item)"
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
