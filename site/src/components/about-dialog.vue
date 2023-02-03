<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {dataProvider} from '@/scripts/data/data';
import {mdiClose, mdiEmail} from '@mdi/js';
import {useVModel} from '@vueuse/core';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);
const description = dataProvider.getDescription();
const __VERSION__ = import.meta.env.VITE_VERSION;
const __BUILD_TIME__ = import.meta.env.VITE_BUILD_TIME;
</script>

<template>
    <v-dialog v-model="dialog">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>About</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-card-title>{{ `${description.Description} Calculator/Factory Builder` }}</v-card-title>
            <v-card-subtitle>
                By doubleaxe (<v-icon :icon="mdiEmail" /><a href="mailto:dax@xdax.ru" target="_blank">dax@xdax.ru</a>,
                <a href="https://github.com/doubleaxe" target="_blank">https://github.com/doubleaxe</a>)
            </v-card-subtitle>
            <v-card-text>
                <v-list :lines="undefined">
                    <v-list-item title="Game">
                        <v-list-item-subtitle>
                            <a v-if="description.Url" :href="description.Url" target="_blank">{{ description.Description }}</a>
                            <span v-else>{{ description.Description }}</span>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item title="Game version" :subtitle="description.Version" />
                    <v-list-item title="Build version" :subtitle="__VERSION__" />
                    <v-list-item title="Build time" :subtitle="__BUILD_TIME__" />
                    <v-list-item title="Bug reports">
                        <v-list-item-subtitle>
                            <a href="https://github.com/doubleaxe/evospace-calculator/issues" target="_blank">
                                https://github.com/doubleaxe/evospace-calculator/issues
                            </a>
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
