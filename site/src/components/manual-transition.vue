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
