<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script lang="ts">
export default {
    inheritAttrs: false,
};
</script>
<script setup lang="ts">
const props = defineProps<{
    tooltip: string;
}>();
</script>

<template>
    <v-tooltip :text="props.tooltip" location="bottom">
        <template #activator="{ props: _props }">
            <v-btn v-bind="{..._props, ...$attrs}" />
        </template>
    </v-tooltip>
</template>
