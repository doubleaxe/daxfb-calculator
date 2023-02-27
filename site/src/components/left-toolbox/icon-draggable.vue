<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {useLeftPanelDragAndDrop} from '@/composables/drag-helpers';
import {computed, nextTick, ref, unref, watch} from 'vue';

const {isDragging, currentItem, screenRect, movableElem} = useLeftPanelDragAndDrop();

const draggableClass = ref('');
const draggableStyle = computed(() => {
    const _isDragging = unref(isDragging);
    const _dragRect = unref(screenRect);
    if(!_isDragging || !_dragRect) {
        return {};
    }
    return {
        left: `${_dragRect.x}px`,
        top: `${_dragRect.y}px`,
    };
});

watch(isDragging, (value) => {
    if(!value) {
        draggableClass.value = 'icon-draggable-hidden';
    } else {
        //this is against flickering, so first position is set, and next icon is shown
        //otherwise it sometimes jump out of somewhere
        nextTick(() => {
            draggableClass.value = '';
        });
    }
}, {immediate: true});
</script>

<template>
    <manual-transition :animate="isDragging">
        <v-sheet
            ref="movableElem"
            class="rounded dragging-elevation icon-draggable hover-background"
            :class="draggableClass"
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
<style>
.icon-draggable-hidden {
    z-index: -1;
    opacity: 0;
}
</style>
