<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
-->
<script setup lang="ts">
import {useLeftPanelDragAndDrop} from '@/composables/drag-helpers';
import {computed, unref} from 'vue';

const {isDragging, currentItem, screenRect, movableElem} = useLeftPanelDragAndDrop();

const draggableStyle = computed(() => {
    const _isDragging = unref(isDragging);
    const _dragRect = unref(screenRect);
    //keep far offscreen, so drag-n-drop processor could get width and height
    if(!_isDragging || !_dragRect) {
        return {left: '-10000px', top: '-10000px'};
    }
    return {
        left: `${_dragRect.x}px`,
        top: `${_dragRect.y}px`,
    };
});
</script>

<template>
    <manual-transition :animate="isDragging">
        <v-sheet
            ref="movableElem"
            class="rounded dragging-elevation icon-draggable hover-background"
            :style="draggableStyle"
        >
            <icon-component :image="currentItem?.image || ''" />
        </v-sheet>
    </manual-transition>
</template>

<style scoped>
.icon-draggable {
    position: fixed;
    z-index: 5000;
}
</style>
