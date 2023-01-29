<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {SelectedClassType, usePointAndClick} from '@/composables/drag-helpers';
import type {BlueprintItemModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {mdiDelete, mdiLinkOff, mdiMenu, mdiPlusBox, mdiMinusBox, mdiCursorMove, mdiCheck} from '@mdi/js';
import {ref, unref, watch} from 'vue';

const props = defineProps<{
    item: BlueprintItemModel;
}>();

const settings = injectSettings();
const {selectItem} = usePointAndClick();

const menuOpened = ref(false);
const tempCount = ref<string | number>(1);

function updateCount() {
    let value = unref(tempCount);
    if(typeof(value) != 'number') {
        value = parseFloat(value);
    }
    if(isNaN(value)) {
        value = 1;
    } else if(value <= 0) {
        value = 0;
    }
    props.item.setCount(value);
    tempCount.value = value;
}
function addCount(delta: number) {
    updateCount();
    tempCount.value = Number(unref(tempCount)) + delta;
    updateCount();
}

watch(menuOpened, (value) => {
    if(value) {
        tempCount.value = props.item.count;
    }
});
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
                        v-model="tempCount"
                        class="count-number"
                        density="compact"
                        hide-details
                        clearable
                        persistent-clear
                        type="number"
                        min="0"
                        :append-icon="mdiPlusBox"
                        :prepend-icon="mdiMinusBox"
                        :append-inner-icon="mdiCheck"
                        @blur="updateCount"
                        @click:append-inner="updateCount"
                        @click:clear="tempCount = 1; updateCount();"
                        @click:append="addCount(1)"
                        @click:prepend="addCount(-1)"
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
.count-number {
    width: 15em;
}
</style>
