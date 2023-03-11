<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {BlueprintItemModel} from '@/scripts/model/store';
import {mdiDelete, mdiLinkOff, mdiMenu} from '@mdi/js';
import {ref} from 'vue';

const props = defineProps<{
    item: BlueprintItemModel;
}>();

const menuOpened = ref(false);
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
                <v-list-item title="Lock" @click="props.item.setLocked(!props.item.isLocked)">
                    <template #prepend>
                        <v-list-item-action start>
                            <!-- eslint-disable-next-line vue/no-mutating-props -->
                            <v-checkbox v-model="props.item.isLocked" hide-details />
                        </v-list-item-action>
                    </template>
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
