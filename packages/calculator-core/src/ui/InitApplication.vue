<script setup lang="ts">
import { useProvideDarkModeStore } from '#core/stores/DarkModeStore.js';

useProvideDarkModeStore();
</script>

<template>
    <div>
        <slot />
    </div>
</template>
