<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {GameItemType} from '#types/constants';
import {formatItem} from '@/scripts/format';
import type {SummaryTotal} from '@/scripts/model/store';
import {computed} from 'vue';

const props = defineProps<{
    total: SummaryTotal;
    compact?: boolean;
    format?: boolean;
}>();

const totalCountPerSecond = computed(() => (props.format
    ? formatItem(props.total.totalCountPerSecond, props.total.sampleItem)
    : props.total.totalCountPerSecond)
    || '');

const typeLables: Record<GameItemType, string> = {
    [GameItemType.Unknown]: '',
    [GameItemType.Solid]: 'Solid',
    [GameItemType.Liquid]: 'Liquid',
    [GameItemType.Gas]: 'Gas',
    [GameItemType.Fluid]: 'Fluid',
    [GameItemType.Countable]: 'Countable',
    [GameItemType.Loose]: 'Loose',
    [GameItemType.Molten]: 'Molten',
    [GameItemType.Energy]: 'Energy',
    [GameItemType.Special]: 'Special',
};
</script>

<template>
    <v-list-item :class="props.compact ? 'pl-0' : ''">
        <template #prepend>
            <div v-if="props.compact" class="text-caption text-info font-weight-bold">
                {{ totalCountPerSecond }}
            </div>
        </template>
        <template #title>
            <div v-if="!props.compact" class="pl-2 text-body-2 text-info font-weight-bold">
                {{ totalCountPerSecond }}
                {{ ` Total ${typeLables[props.total.type]}` }}
            </div>
        </template>
    </v-list-item>
</template>
