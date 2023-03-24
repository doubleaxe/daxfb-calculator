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
    <v-list-item class="pl-0">
        <template #prepend>
            <div class="d-flex flex-column align-start">
                <icon-component :image="props.item.item.image" />
                <div class="text-caption">
                    {{ totalCountPerSecond }}
                </div>
            </div>
        </template>
    </v-list-item>
</template>

<style scoped>
.icon-parent {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>
