<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
-->
<script setup lang="ts">
import {nextTick, ref, watch} from 'vue';

const props = defineProps<{
    animate: boolean;
}>();
const showAnimation = ref(true);

watch(() => props.animate, (value, oldValue) => {
    if(value && !oldValue) {
        showAnimation.value = false;
        nextTick(() => {
            showAnimation.value = true;
        });
    }
});
</script>

<template>
    <v-scale-transition v-show="showAnimation">
        <slot />
    </v-scale-transition>
</template>
