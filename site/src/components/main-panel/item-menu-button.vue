<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {BlueprintItemModel} from '@/scripts/model/store';
import {Objective, type ObjectiveType} from '@/scripts/types';
import {mdiDelete, mdiLinkOff, mdiMenu, mdiLock, mdiBullseye, mdiBullseyeArrow, mdiTransferDown} from '@mdi/js';
import {computed, ref} from 'vue';

const props = defineProps<{
    item: BlueprintItemModel;
}>();

const menuOpened = ref(false);

type OptionType = 'lock' | keyof typeof Objective;
const itemOptions = computed(() => {
    const options: OptionType[] = [];
    if(props.item.isLocked) {
        options.push('lock');
    }
    for(const [key, value] of Object.entries(Objective)) {
        if(value === props.item.objective) {
            options.push(key as keyof typeof Objective);
        }
    }
    return options;
});
function changeObjective(objective: ObjectiveType) {
    const oldObjective = props.item.objective;
    if(oldObjective === objective) {
        props.item.setObjective(undefined);
    } else {
        props.item.setObjective(objective);
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
                        <tooltip-button
                            tooltip="Primary Objective"
                            :icon="mdiBullseyeArrow"
                            value="Primary"
                            @click="changeObjective(Objective.Primary)"
                        />
                        <tooltip-button
                            tooltip="Secondary Objective"
                            :icon="mdiBullseye"
                            value="Secondary"
                            @click="changeObjective(Objective.Secondary)"
                        />
                        <tooltip-button
                            tooltip="Low Priority Objective"
                            :icon="mdiTransferDown"
                            value="LowPriority"
                            @click="changeObjective(Objective.LowPriority)"
                        />
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
