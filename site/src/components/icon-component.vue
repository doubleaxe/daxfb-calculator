<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {computed} from 'vue';
import {mdiAlert} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';
import {injectGameData} from '@/scripts/data';

const props = defineProps<{
    image: string;
}>();

const gameData = injectGameData();
const settings = injectSettings();

const styleObject = computed(() => {
    const location = gameData.getImage(props.image);
    if(!location)
        return undefined;
    return {
        width: `${settings.iconSize}px`,
        height: `${settings.iconSize}px`,
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
.icon-warning {
    display: block;
}
</style>
