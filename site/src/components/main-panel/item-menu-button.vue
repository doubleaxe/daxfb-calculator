<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {BlueprintItemModel} from '@/scripts/model/store';
import {DEFAULT_PRIORITY, LOWER_PRIORITY, LOWEST_PRIORITY, type PriorityType} from '@/scripts/types';
import {mdiDelete, mdiLinkOff, mdiMenu, mdiLock, mdiArrowDownBold, mdiTransferDown} from '@mdi/js';
import {computed, ref} from 'vue';

const props = defineProps<{
    item: BlueprintItemModel;
}>();

const menuOpened = ref(false);

type OptionType = 'lock' | 'lower' | 'lowest';
const itemOptions = computed(() => {
    const options: OptionType[] = [];
    if(props.item.isLocked) {
        options.push('lock');
    }
    if(props.item.priority === LOWER_PRIORITY) {
        options.push('lower');
    } else if(props.item.priority === LOWEST_PRIORITY) {
        options.push('lowest');
    }
    return options;
});
function changePriority(priority: PriorityType) {
    const oldPriority = props.item.priority;
    if(oldPriority === priority) {
        props.item.setPriority(DEFAULT_PRIORITY);
    } else {
        props.item.setPriority(priority);
    }
}
</script>

<template>
    <v-btn size="x-small" color="secondary" variant="outlined" @pointerdown.left.stop @click.stop>
        <v-icon :icon="mdiMenu" />
        <v-menu v-model="menuOpened" density="compact" activator="parent" :close-on-content-click="false">
            <v-list>
                <v-list-item title="Count">
                    <input-number
                        class="count-number"
                        :model-value="props.item.count"
                        :min="0"
                        :default-value="1"
                        spin-icons
                        @update:model-value="props.item.setCount($event);"
                    />
                </v-list-item>
                <v-list-item class="d-flex justify-center">
                    <v-btn-toggle color="primary" multiple :model-value="itemOptions">
                        <tooltip-button tooltip="Lock" :icon="mdiLock" value="lock" @click="props.item.setLocked(!props.item.isLocked)" />
                        <tooltip-button tooltip="Lower Priority" :icon="mdiArrowDownBold" value="lower" @click="changePriority(LOWER_PRIORITY)" />
                        <tooltip-button tooltip="Lowest Priority" :icon="mdiTransferDown" value="lowest" @click="changePriority(LOWEST_PRIORITY)" />
                    </v-btn-toggle>
                </v-list-item>
                <v-divider />
                <v-list-item
                    :prepend-icon="mdiLinkOff"
                    title="Delete all links"
                    @click="props.item.deleteAllLinks(); menuOpened = false;"
                />
                <v-list-item
                    :prepend-icon="mdiDelete"
                    title="Delete"
                    @click="props.item.deleteThis()"
                />
            </v-list>
        </v-menu>
    </v-btn>
</template>

<style scoped>
.count-number {
    width: 15em;
}
</style>
