<script setup lang="ts">
import {computed} from 'vue';
import type {RecipeIOModel} from '@/scripts/model/store';
import {formatIo} from '@/scripts/format';

const props = defineProps<{
    io: RecipeIOModel;
}>();
const emit = defineEmits<{
    (e: 'link-drag-begin', item?: RecipeIOModel): void;
    (e: 'link-drag-force'): void;
}>();

function isLtr() {
    return props.io.isFlipped ? !props.io.isInput : props.io.isInput;
}
const direction = computed(() => isLtr() ? 'flex-row' : 'flex-row-reverse');
const align = computed(() => isLtr() ? 'text-left' : 'text-right');
</script>

<template>
    <div class="io-parent" :class="direction">
        <icon-component-tooltip
            class="io-icon-row rounded hover-elevation"
            :image="props.io.image"
            :tooltip="props.io.label"
            @pointerdown.stop="emit('link-drag-begin', props.io)"
            @pointerup.stop="emit('link-drag-begin')"
        />
        <div
            class="io-description-row text-caption hover-border"
            :class="[align]"
        >
            {{ formatIo(props.io.cpsSolvedTotal, props.io) || '?' }}
            <br>
            {{ formatIo(props.io.cpsMaxTotal, props.io) }}
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
