<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {LinkModel} from '@/scripts/model/store';
import {computed, ref, unref} from 'vue';
import {Rect} from '@/scripts/geometry';
import {injectSettings} from '@/scripts/settings';

const props = defineProps<{
    link?: LinkModel;
}>();

const settings = injectSettings();
const mainDivElement = ref<HTMLElement | null>(null);
const computedStyle = computed(() => {
    const link = props.link;
    let middlePoint = link?.buildShape()?.middlePoint;
    const mainDiv = unref(mainDivElement);
    if(!middlePoint || !mainDiv)
        return {};
    let mainDivRect = Rect.assign(mainDiv.getBoundingClientRect());
    if(settings.scale && (settings.scale != 1)) {
        mainDivRect = mainDivRect.scaleSize(1 / settings.scale);
    }
    middlePoint = middlePoint.offsetBy({x: mainDivRect.width / 2, y: mainDivRect.height / 2}, -1);
    return {
        left: middlePoint.x + 'px',
        top: middlePoint.y + 'px',
    };
});
</script>

<template>
    <div
        ref="mainDivElement"
        class="rounded-pill link-connector bg-window-idle hover-border"
        :style="computedStyle"
        @pointerdown.left.stop
        @click.stop
    >
        <icon-component :image="props.link?.input?.image" />
        <link-menu :link="props.link" />
    </div>
</template>

<style scoped>
.link-connector {
    position: absolute;
    user-select: none;
}
</style>
