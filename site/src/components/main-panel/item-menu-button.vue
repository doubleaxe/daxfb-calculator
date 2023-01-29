<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {SelectedClassType, usePointAndClick} from '@/composables/drag-helpers';
import type {BlueprintItemModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {mdiDelete, mdiLinkOff, mdiMenu, mdiPlusBox, mdiMinusBox, mdiCursorMove} from '@mdi/js';
import {ref} from 'vue';

const props = defineProps<{
    item: BlueprintItemModel;
}>();

const settings = injectSettings();
const {selectItem} = usePointAndClick();

const menuOpened = ref(false);
function setCount(value: number | string) {
    if(typeof(value) == 'string')
        value = Number(value) || 1;
    if(value <= 0)
        value = 1;
    props.item.setCount(Math.round(value));
}
function addCount(delta: number) {
    if((props.item.count + delta) <= 0)
        return;
    setCount(props.item.count + delta);
}
</script>

<template>
    <v-btn size="x-small" color="secondary" variant="outlined" @pointerdown.left.stop @click.stop>
        <v-icon :icon="mdiMenu" />
        <v-menu v-model="menuOpened" density="compact" activator="parent" :close-on-content-click="false">
            <v-list>
                <v-list-item
                    v-if="settings.pointAndClickEnabled"
                    :prepend-icon="mdiCursorMove"
                    title="Move"
                    @click="selectItem(SelectedClassType.BlueprintItemModel, props.item); menuOpened = false;"
                />

                <v-list-item title="Count">
                    <v-text-field
                        density="compact"
                        hide-details
                        :append-icon="mdiPlusBox"
                        :prepend-icon="mdiMinusBox"
                        :value="props.item.count"
                        @click:append="addCount(1)"
                        @click:prepend="addCount(-1)"
                        @input="(event: InputEvent) => setCount(((event.target) as HTMLInputElement).value)"
                    />
                </v-list-item>
                <!-- eslint-disable-next-line vue/no-mutating-props -->
                <v-list-item title="Lock" @click="(props.item.isLocked = !props.item.isLocked)">
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
.io-menu-item {
    display: flex;
    align-items: center;
}
</style>
