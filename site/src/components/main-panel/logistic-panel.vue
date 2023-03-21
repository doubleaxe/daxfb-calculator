<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {LogisticModel} from '@/scripts/model/store';
import {computed} from 'vue';

const props = defineProps<{
    logistic?: LogisticModel;
}>();

const countPerSecond = computed(() => props.logistic?.calculateTransport()?.countPerSecond);

</script>

<template>
    <v-list-item :title="countPerSecond" />
</template>

<style scoped>
</style>
