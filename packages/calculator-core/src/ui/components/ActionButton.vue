<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import Button from 'primevue/button';
</script>

<template>
    <Button :class="css({ padding: 0 })" severity="secondary" size="small" variant="outlined">
        <slot />
    </Button>
</template>
