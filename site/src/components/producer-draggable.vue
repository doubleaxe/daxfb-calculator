<script setup lang="ts">
import {watch, ref, unref, nextTick} from 'vue';
import {useTimeoutFn, useDraggable, useMouse} from '@vueuse/core';

const props = defineProps<{
    activating: boolean,
}>();

const showDraggable = ref(false);
const element = ref<HTMLElement | null>(null);

const {x: pageX, y: pageY} = useMouse();
const startDragging = () => {
    nextTick(() => {
        const mouseDown = new Event('pointerdown');
        Object.assign(mouseDown, {pageX: unref(pageX), pageY: unref(pageY)});
        element.value?.dispatchEvent(mouseDown);
    });
};
const {isPending: isActivating, start: startActivate, stop: stopActivate} = useTimeoutFn(() => {
    showDraggable.value = true;

}, 2000, {immediate: false});

watch(() => props.activating, (activating) => {
    if(activating)
        startDragging();
    activating ? startActivate() : stopActivate();
});

const {style} = useDraggable(element, {
    initialValue: {x: 0, y: 0},
});
</script>

<template>
    <div v-show="showDraggable" ref="element" :style="style" class="draggable-producer">
        drag me drag
    </div>
</template>

<style scoped>
.draggable-producer {
    position: fixed;
}
</style>
