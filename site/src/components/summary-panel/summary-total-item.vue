<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {formatItem} from '@/scripts/format';
import type {SummaryTotal} from '@/scripts/model/store';
import {computed} from 'vue';

const props = defineProps<{
    total: SummaryTotal;
    compact?: boolean;
}>();

const totalCountPerSecond = computed(() => formatItem(props.total.totalCountPerSecond, props.total.sampleItem) || '');
</script>

<template>
    <v-list-item class="pl-0">
        <template #prepend>
            <div class="text-caption">
                {{ totalCountPerSecond }}
            </div>
        </template>
    </v-list-item>
</template>
