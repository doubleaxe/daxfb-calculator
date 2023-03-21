<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {LinkModel} from '@/scripts/model/store';
import {computed, ref} from 'vue';
import {mdiLinkOff} from '@mdi/js';
import {formatIo} from '@/scripts/format';

const props = defineProps<{
    link?: LinkModel;
}>();

const menuOpened = ref(false);
const logisticSet = computed(() => {
    if(!props.link?.flow) {
        return [];
    }
    const _logistic = props.link?.logistic;
    if(!_logistic?.logisticCount) {
        return [];
    }
    return [..._logistic.logistic];
});
const flowTotal = computed(() => props.link?.input ? formatIo(props.link.flow, props.link.input) : '');

</script>

<template>
    <v-menu
        v-model="menuOpened"
        density="compact"
        activator="parent"
        :close-on-content-click="false"
    >
        <v-list>
            <v-list-item
                :prepend-icon="mdiLinkOff"
                title="Delete"
                @click="props.link?.deleteThis(); menuOpened = false;"
            />
            <template v-if="logisticSet.length">
                <v-list-item :title="flowTotal" />
                <template v-for="logistic in logisticSet" :key="logistic.name">
                    <logistic-panel :logistic="logistic" />
                </template>
            </template>
        </v-list>
    </v-menu>
</template>

<style scoped>
</style>
