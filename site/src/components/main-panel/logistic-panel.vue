<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {LogisticModel} from '@/scripts/model/store';
import {computed, unref} from 'vue';
import {formatTransport} from '@/scripts/format';
import {mdiTransferLeft, mdiTransferRight, mdiLock, mdiLockOpenVariant} from '@mdi/js';

const props = defineProps<{
    logistic?: LogisticModel;
}>();
const selectedTransport = computed(() => props.logistic?.selectedTransport);
const count = computed(() => unref(selectedTransport)?.count || 0);
const countPerSecond = computed(() => {
    const _selectedTransport = unref(selectedTransport);
    const _count = unref(count) || 0;
    if(_selectedTransport && (_count > 1)) {
        return formatTransport(_selectedTransport.countPerSecond, _selectedTransport);
    }
    return '';
});
const totalCountPerSecond = computed(() => {
    const _selectedTransport = unref(selectedTransport);
    const _count = unref(count) || 0;
    if(_selectedTransport) {
        const _countPerSecond = _count * _selectedTransport.countPerSecond;
        return formatTransport(_countPerSecond, _selectedTransport);
    }
    return '';
});
const isLocked = computed(() => props.logistic?.isLocked);

</script>

<template>
    <v-list-item>
        <v-list-item-title>
            <div class="font-weight-bold text-caption">
                {{ selectedTransport?.label }}
            </div>
            <div class="transport-menu-item">
                {{ count }}&nbsp;x&nbsp;
                <icon-component :image="selectedTransport?.item?.image" />&nbsp;
                {{ totalCountPerSecond }}&nbsp;
                <span class="text-caption">{{ countPerSecond }}</span>
            </div>
        </v-list-item-title>
        <template #prepend>
            <v-btn icon size="x-small" @click="props.logistic?.switchSelectedTransport(-1)">
                <v-icon :icon="mdiTransferLeft" />
            </v-btn>
            <v-btn icon size="x-small" class="mr-2" @click="props.logistic?.switchSelectedTransport(1)">
                <v-icon :icon="mdiTransferRight" />
            </v-btn>
        </template>
        <template #append>
            <v-btn icon size="x-small" class="ml-2" @click="props.logistic?.toggleLockSelected()">
                <v-icon :icon="isLocked ? mdiLock : mdiLockOpenVariant" :color="isLocked ? 'success' : ''" />
            </v-btn>
        </template>
    </v-list-item>
</template>

<style scoped>
.transport-menu-item {
    display: flex;
    align-items: center;
}
</style>
