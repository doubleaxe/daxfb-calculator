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

const highlightBorderSide = () => {
    switch(props.io.highlightBorder) {
        case 1: return 'highlight-upper-border';
        case -1: return 'highlight-lower-border';
        default: return undefined;
    }
};
const computedIconClass = computed(() => {
    const _highlightBorder = highlightBorderSide();
    const cls = [
        _highlightBorder || (unref(selectedItem)?.isSelected(props.io) ? 'selected-border' : undefined),
    ].filter(Boolean);
    return cls;
});
const computedDescriptionClass = computed(() => {
    const causesSolvingError = props.io.causesSolvingError ? 'bg-error' : '';
    const cls = [
        isLtr() ? 'text-left' : 'text-right',
        causesSolvingError || (props.io.hasProbability ? 'bg-has-probability' : undefined),
        ((filter.key == props.io.name) ? 'highlight-border' : undefined),
    ].filter(Boolean);
    return cls;
});

function isLtr() {
    return props.io.isFlipped ? !props.io.isInput : props.io.isInput;
}
const direction = computed(() => isLtr() ? 'flex-row' : 'flex-row-reverse');
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
    <div class="io-parent" :class="direction">
        <icon-component
            class="io-icon-row rounded hover-elevation"
            :class="computedIconClass"
            :image="props.io.image"
            :data-tooltip="props.io.label"
            :data-io-id="props.io.key"
            @click="selectItem(SelectedClassType.RecipeIOModel, props.io)"
            @pointerdown.left.stop="dragStart($event, newLinkDragAndDropItem())"
            @click.stop
        />
        <div
            class="io-description-row text-caption hover-border"
            :class="computedDescriptionClass"
            @pointerdown.left.stop
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
