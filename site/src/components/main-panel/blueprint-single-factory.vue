<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {computed} from 'vue';
import type {BlueprintItemModel} from '@/scripts/model/store';
import {mdiArrowLeft, mdiArrowRight, mdiPlusThick, mdiMinusThick} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';

const settings = injectSettings();

const props = defineProps<{
    item: BlueprintItemModel;
}>();
const emit = defineEmits<{
    (e: 'recipes-menu-activate', activator: Element): void;
}>();

const isFat = computed(() => {
    const _recipe = props.item?.selectedRecipe;
    return ((_recipe?.visibleInput()?.length || 0) > 1) || ((_recipe?.visibleOutput()?.length || 0) > 1);
});

const icon = computed(() => (props.item.isFlipped ? mdiArrowLeft : mdiArrowRight));
function flip() {
    // eslint-disable-next-line vue/no-mutating-props
    props.item.isFlipped = !props.item.isFlipped;
}
function count(offset: number) {
    props.item.setCount(Math.max(props.item.count + offset, 0));
}

</script>

<template>
    <div class="align-self-center d-flex flex-column align-center" @pointerdown.left.stop @click.stop>
        <v-btn
            v-if="isFat && settings.showCountControlsOnWindow"
            variant="tonal"
            density="comfortable"
            size="x-small"
            @click="count(1)"
        >
            <v-icon class="align-self-center" :icon="mdiPlusThick" />
        </v-btn>
        <div class="d-flex flex-row align-center">
            <v-btn
                v-if="!isFat && settings.showCountControlsOnWindow"
                :icon="mdiMinusThick"
                variant="tonal"
                density="comfortable"
                size="x-small"
                @click="count(-1)"
            />
            <icon-component
                class="main-icon-row rounded hover-border"
                :image="props.item?.image"
                :tooltip="props.item?.label"
                @click="emit('recipes-menu-activate', $event.currentTarget)"
            />
            <v-btn
                v-if="!isFat && settings.showCountControlsOnWindow"
                :icon="mdiPlusThick"
                variant="tonal"
                density="comfortable"
                size="x-small"
                @click="count(1)"
            />
        </div>
        <v-btn
            v-if="isFat && settings.showCountControlsOnWindow"
            class="mb-2"
            variant="tonal"
            density="comfortable"
            size="x-small"
            @click="count(-1)"
        >
            <v-icon class="align-self-center" :icon="mdiMinusThick" />
        </v-btn>
        <v-btn
            variant="outlined"
            rounded="pill"
            size="x-small"
            @click="flip"
        >
            <v-icon class="align-self-center" :icon="icon" />
        </v-btn>
    </div>
</template>

<style scoped>
.main-icon-row {
    display: block;
}
</style>
