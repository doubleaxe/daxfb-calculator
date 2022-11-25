<script setup lang="ts">
import {computed} from 'vue';
import type {Images} from '../../data';
import imagesJson from '../../data/images.json';
import {MdWarning} from '@vicons/ionicons4';

const RESOLUTION = 32;

const props = defineProps<{
    image: string
}>();

const styleObject = computed(() => {
    const location = (imagesJson as Images)[props.image];
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
        <n-icon v-if="!styleObject" size="32" :component="MdWarning" color="#f0a020" />
    </div>
</template>

<style scoped>
.icon-component {
    background-image: url(../../data/images.png);
    width: 32px;
    height: 32px;
}
</style>
