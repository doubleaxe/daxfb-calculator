<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import Button from 'primevue/button';
import type { Component } from 'vue';

const { icon } = defineProps<{
    icon: Component;
}>();

defineOptions({ inheritAttrs: false });
</script>

<template>
    <Button v-bind="$attrs" :class="css({ padding: 0 })" severity="secondary" size="small" variant="outlined">
        <component :is="icon" :size="18" />
    </Button>
</template>
