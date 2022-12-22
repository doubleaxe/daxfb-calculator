<script setup lang="ts">
//this v-tooltip is optimized for many tooltip list
//it is created only once for all children, and then watches children to show tooltip
//not so laggy inside debugger, and maybe better in slower browsers

import {Point, Rect} from '@/scripts/geometry';
import {useTimeoutFn} from '@vueuse/core';
import {reactive} from 'vue';

const tooltipObject: {
    tooltipText: string;
    tooltipElement: Element | null;
    rect: Rect | null;
    text: string;
    activator: Element | string;
    show: boolean;
} = reactive({
    tooltipText: '',
    tooltipElement: null,
    rect: null,
    text: '',
    activator: '',
    show: false,
});

const {start: startTooltipTimeout, stop: cancelTooltipTimeout} = useTimeoutFn(() => {
    tooltipObject.text = tooltipObject.tooltipText;
    tooltipObject.activator = tooltipObject.tooltipElement || '';
    tooltipObject.show = true;
}, 500, {immediate: false});

function cancelTooltip() {
    tooltipObject.tooltipText = '';
    tooltipObject.tooltipElement = null;
    tooltipObject.rect = null;
    tooltipObject.text = '';
    tooltipObject.activator = '';
    tooltipObject.show = false;
    cancelTooltipTimeout();
}

function onPointerMove(evt: PointerEvent) {
    const point = new Point({x: evt.pageX, y: evt.pageY});
    if(tooltipObject?.rect?.isPointInRect(point))
        return;
    if(tooltipObject.tooltipElement)
        cancelTooltip();
    const elements = document.elementsFromPoint(evt.pageX, evt.pageY);
    let tooltipText = null;
    const tooltipElement = elements.find((element) => {
        tooltipText = element.getAttribute('data-tooltip');
        return !!tooltipText;
    });
    if(!tooltipElement || !tooltipText)
        return;
    tooltipObject.tooltipText = tooltipText;
    tooltipObject.tooltipElement = tooltipElement;
    tooltipObject.rect = new Rect(tooltipElement.getBoundingClientRect());
    startTooltipTimeout();
}
</script>

<template>
    <div @pointermove="onPointerMove">
        <v-tooltip
            v-model="tooltipObject.show"
            :activator="tooltipObject.activator"
            :text="tooltipObject.text"
            location="top"
        />
        <slot />
    </div>
</template>
