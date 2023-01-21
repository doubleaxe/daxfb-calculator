<script setup lang="ts">
import {ref, unref, nextTick, type Ref} from 'vue';
import {useTimeoutFn, useDraggable, useMouse} from '@vueuse/core';
import type {ReadonlyPointType} from '@/scripts/geometry';

const props = defineProps<{
    width: number;
    height: number;
    immediate?: boolean;
}>();
const emit = defineEmits<{
    (e: 'drag-shown', position: ReadonlyPointType): void;
    (e: 'drag-move', position: ReadonlyPointType, element: Ref<HTMLElement | null>): void;
    (e: 'drop', position: ReadonlyPointType): void;
}>();

//we use separate props because when element is hidden - its position doesn't update
const activateDraggable = ref(false);
const showDraggable = ref(false);
const element = ref<HTMLElement | null>(null);
const {x: pageX, y: pageY} = useMouse();

const {start: startDragActivateTimeout, stop: cancelDragActivateTimeout} = useTimeoutFn(() => {
    showDraggableMarker();
}, 300, {immediate: false});

const {style, x: elementX, y: elementY} = useDraggable(element, {
    onMove: (position) => {
        emit('drag-move', position, element);
    },
    onEnd: (position) => {
        activateDraggable.value = false;
        cancelDragActivateTimeout();
        showDraggable.value = false;
        emit('drop', position);
    }
});

function startDragging() {
    activateDraggable.value = true;
    elementX.value = unref(pageX) - (props.width >> 1);
    elementY.value = unref(pageY) - (props.height >> 1);
    nextTick(() => {
        const mouseDown = new Event('pointerdown');
        Object.assign(mouseDown, {pageX: unref(pageX), pageY: unref(pageY)});
        element.value?.dispatchEvent(mouseDown);
        if(props.immediate)
            showDraggableMarker();
    });
}

function showDraggableMarker() {
    showDraggable.value = true;
    emit('drag-shown', {x: unref(elementX), y: unref(elementY)});
}

function requestDragBegin(begin: boolean) {
    //start dragging immediatelly, but show dragged element a bit later.
    //if user does simple click dragged element won't be shown.
    //if user drags - dragged element will track position even if it shown later.
    cancelDragActivateTimeout();
    showDraggable.value = false;
    if(begin) {
        startDragging();
        if(!props.immediate)
            startDragActivateTimeout();
    }
}

function requestDragForce() {
    cancelDragActivateTimeout();
    showDraggableMarker();
}

defineExpose({
    requestDragBegin,
    requestDragForce,
});
</script>

<template>
    <div v-show="activateDraggable" ref="element" :style="style" class="draggable-producer">
        <div :class="{'draggable-transparent': !showDraggable}">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.draggable-producer {
    position: fixed;
    z-index: 5000;
}
.draggable-transparent {
    opacity: 0;
}
</style>
