<script setup lang="ts">
import type {BlueprintItemModel} from '@/scripts/model/store';
import {mdiDelete, mdiLinkOff, mdiMenu, mdiPlusBox, mdiMinusBox} from '@mdi/js';
import {ref} from 'vue';

const props = defineProps<{
    item: BlueprintItemModel;
}>();

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
    <v-btn size="x-small" color="secondary" variant="outlined" @pointerdown.stop="">
        <v-icon :icon="mdiMenu" />
        <v-menu v-model="menuOpened" density="compact" activator="parent" :close-on-content-click="false">
            <v-card>
                <v-list>
                    <v-list-item title="Count">
                        <v-text-field
                            density="compact"
                            :append-icon="mdiPlusBox"
                            :prepend-icon="mdiMinusBox"
                            :value="props.item.count"
                            @click:append="addCount(1)"
                            @click:prepend="addCount(-1)"
                            @input="(event: InputEvent) => setCount(((event.target) as HTMLInputElement).value)"
                        />
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
            </v-card>
        </v-menu>
    </v-btn>
</template>

<style scoped>
.io-menu-item {
    display: flex;
    align-items: center;
}
</style>
