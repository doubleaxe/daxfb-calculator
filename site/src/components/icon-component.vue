<script setup lang="ts">
import {computed} from 'vue';
import {imagesJson} from '../scripts/data-parsed';
import {mdiAlert} from '@mdi/js';

const RESOLUTION = 32;

const props = defineProps<{
    image: string;
}>();

const styleObject = computed(() => {
    const location = imagesJson[props.image];
    if(!location)
        return undefined;
    return {
        'background-position': `${(-location[0] * RESOLUTION).toFixed(0)}px ${(-location[1] * RESOLUTION).toFixed(0)}px`,
    };
});
</script>

<template>
    <div>
        <div v-if="styleObject" class="icon-component" :style="styleObject" />
        <v-icon
            v-if="!styleObject"
            class="icon-warning"
            :icon="mdiAlert"
            :size="32"
            color="warning"
            role="img"
            aria-hidden="false"
        />
    </div>
</template>

<style scoped>
.icon-component {
    background-image: url(../../data/images.png);
    width: 32px;
    height: 32px;
}
.icon-warning {
    display: block;
}
</style>
