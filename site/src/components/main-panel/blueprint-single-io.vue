<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {computed, watch, unref} from 'vue';
import type {RecipeIOModel} from '@/scripts/model/store';
import {formatIo} from '@/scripts/format';
import {injectFilter} from '@/scripts/filter';
import {SelectedClassType, useLinkDragAndDrop, LinkDragAndDropItem, usePointAndClick} from '@/composables/drag-helpers';

const props = defineProps<{
    io: RecipeIOModel;
}>();
const emit = defineEmits<{
    (e: 'text-update'): void;
}>();

const filter = injectFilter();
const {dragStart} = useLinkDragAndDrop();
const {selectedItem, selectItem} = usePointAndClick();

const computedIconClass = computed(() => {
    if(unref(selectedItem)?.isSelected(props.io))
        return ['selected-border'];
    return [];
});

function isLtr() {
    return props.io.isFlipped ? !props.io.isInput : props.io.isInput;
}
const direction = computed(() => isLtr() ? 'flex-row' : 'flex-row-reverse');
const align = computed(() => isLtr() ? 'text-left' : 'text-right');
const border = computed(() => {
    if(filter.key == props.io.name)
        return 'highlight-border';
    return '';
});
const cpsSolvedTotal = computed(() => formatIo(props.io.cpsSolvedTotal, props.io) || '?');
const cpsMaxTotal = computed(() => formatIo(props.io.cpsMaxTotal, props.io));

function filterForIo() {
    if(filter.key != props.io.name) {
        filter.key = props.io.name;
        filter.direction = props.io.isInput ? 1 : -1;
    } else {
        filter.key = undefined;
    }
}

function newLinkDragAndDropItem() {
    //if used inline, as @pointerdown.left="dragStart($event, new LinkDragAndDropItem(props.io))"
    //it will be transformed to new unref(LinkDragAndDropItem)(props.io) which causes bug
    return new LinkDragAndDropItem(props.io);
}

watch([() => props.io.cpsSolvedTotal, () => props.io.cpsMaxTotal], () => emit('text-update'));
</script>

<template>
    <div class="io-parent" :class="direction" @pointerdown.left.stop @click.stop>
        <icon-component-tooltip
            class="io-icon-row rounded hover-elevation"
            :class="computedIconClass"
            :image="props.io.image"
            :tooltip="props.io.label"
            :data-io-id="props.io.key"
            @click="selectItem(SelectedClassType.RecipeIOModel, props.io)"
            @pointerdown.left="dragStart($event, newLinkDragAndDropItem())"
        />
        <div
            class="io-description-row text-caption hover-border"
            :class="[align, border]"
            @click="filterForIo()"
        >
            {{ cpsSolvedTotal }}
            <br>
            {{ cpsMaxTotal }}
        </div>
    </div>
</template>

<style scoped>
.io-parent {
    flex-wrap: nowrap;
    display: flex;
    align-items: center;
}
.io-icon-row {
    display: block;
}
.io-description-row {
    display: block;
    padding-left: 4px;
    padding-right: 4px;
    flex: 1;
}
</style>
