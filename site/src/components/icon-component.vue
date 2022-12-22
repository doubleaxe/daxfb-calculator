<script setup lang="ts">
import {computed} from 'vue';
import {dataProvider} from '@/scripts/data/data';
import {mdiAlert} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';

const props = defineProps<{
    image: string;
}>();

const settings = injectSettings();

const styleObject = computed(() => {
    const location = dataProvider.getItemImageDef(props.image);
    if(!location)
        return undefined;
    return {
        'width': `${settings.iconSize}px`,
        'height': `${settings.iconSize}px`,
        'background-position': `${(-location[0] * settings.iconSize).toFixed(0)}px ${(-location[1] * settings.iconSize).toFixed(0)}px`,
    };
});
</script>

<template>
    <div>
        <slot />
        <div
            v-if="styleObject"
            class="icon-component"
            :style="styleObject"
        />
        <v-icon
            v-if="!styleObject"
            class="icon-warning"
            :icon="mdiAlert"
            :size="settings.iconSize"
            color="warning"
            role="img"
            aria-hidden="false"
        />
    </div>
</template>

<style scoped>
.icon-component {
    background-image: url(../../data/images.png);
}
.icon-warning {
    display: block;
}
</style>
