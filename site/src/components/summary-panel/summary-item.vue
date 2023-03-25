<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {formatItem} from '@/scripts/format';
import type {SummaryItem} from '@/scripts/model/store';
import {computed} from 'vue';

const props = defineProps<{
    item: SummaryItem;
    compact?: boolean;
}>();

const totalCountPerSecond = computed(() => formatItem(props.item.totalCountPerSecond, props.item.item) || '');
</script>

<template>
    <v-list-item :class="props.compact ? 'pl-0' : ''">
        <template #prepend>
            <div class="d-flex flex-column align-start">
                <icon-component :image="props.item.item.image" />
                <div v-if="props.compact" class="text-caption">
                    {{ totalCountPerSecond }}
                </div>
            </div>
        </template>
        <template #title>
            <div v-if="!props.compact" class="pl-2 text-body-2 details">
                {{ totalCountPerSecond }}
                {{ ' ' }}
                {{ props.item.item.label }}
            </div>
        </template>
    </v-list-item>
</template>

<style scoped>
.details {
    white-space: normal;
}
</style>
