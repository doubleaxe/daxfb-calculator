<script setup lang="ts">
import {unref, computed} from 'vue';
import type {RecipeIOModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';

const props = defineProps<{
    io: RecipeIOModel;
}>();
const emit = defineEmits<{
    (e: 'link-drag-begin', item?: RecipeIOModel): void;
    (e: 'link-drag-force'): void;
}>();

const settings = injectSettings();
const direction = computed(() => unref(props.io).isInput ? 'flex-row-reverse' : 'flex-row');
const align = computed(() => !unref(props.io).isInput ? 'text-left' : 'text-right');
</script>

<template>
    <div class="io-parent" :class="direction">
        <v-hover v-slot="{isHovering, props: props0}">
            <icon-component
                v-bind="props0"
                :class="`elevation-${isHovering ? settings.hoveringElevation : 0}`"
                class="io-icon-row rounded"
                :image="props.io.image"
                @pointerdown.stop="emit('link-drag-begin', props.io)"
                @pointerup.stop="emit('link-drag-begin')"
            />
        </v-hover>
        <v-hover v-slot="{isHovering, props: props0}">
            <div
                class="io-description-row text-caption"
                v-bind="props0"
                :class="[`elevation-${isHovering ? settings.hoveringElevation : 0}`, align]"
            >
                {{ props.io.description }}
            </div>
        </v-hover>
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
