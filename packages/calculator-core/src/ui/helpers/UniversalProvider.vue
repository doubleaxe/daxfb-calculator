<script setup lang="ts">
const props = defineProps<{
    init: () => unknown;
    useProvide: (value: unknown) => unknown;
}>();

props.useProvide(props.init());
</script>

<template>
    <slot />
</template>
