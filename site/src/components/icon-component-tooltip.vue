<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
//separate component, because if we inject v-tooltip inside icon-component
//even with v-if it becomes extremely lagging in menus with debugger
const props = defineProps<{
    image: string;
    tooltip: string;
}>();
</script>

<template>
    <icon-component :image="props.image">
        <slot />
        <v-tooltip v-if="props.tooltip" activator="parent" location="top" open-delay="500">
            {{ props.tooltip }}
        </v-tooltip>
    </icon-component>
</template>
