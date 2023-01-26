<script setup lang="ts">
import {useLeftPanelDragAndDrop} from '@/composables/drag-helpers';
import {computed, unref} from 'vue';

const {isDragging, currentItem, dragRect, movableElem} = useLeftPanelDragAndDrop();

const draggableStyle = computed(() => {
    const _isDragging = unref(isDragging);
    const _dragRect = unref(dragRect);
    //keep far offscreen, so drag-n-drop processor could get width and height
    return {
        left: `${((_isDragging && _dragRect?.x) || -10000)}px`,
        top: `${((_isDragging && _dragRect?.y) || -10000)}px`,
    };
});
</script>

<template>
    <manual-transition :animate="isDragging">
        <v-sheet
            ref="movableElem"
            class="rounded dragging-elevation icon-draggable"
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
