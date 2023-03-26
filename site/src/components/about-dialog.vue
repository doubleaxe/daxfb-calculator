<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {injectGameData} from '@/scripts/data';
import {mdiClose, mdiEmail} from '@mdi/js';
import {useVModel} from '@vueuse/core';
import logo from '../assets/logo.png';

function padNumber(num: number, padding?: number) {
    return num.toString().padStart(padding || 2, '0');
}

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);
const {gameDescription} = injectGameData();
const __VERSION__ = import.meta.env.VITE_VERSION;
const btime = new Date(import.meta.env.VITE_BUILD_TIME);
const __BUILD_TIME_STR__ = `${padNumber(btime.getFullYear(), 4)}-${padNumber(btime.getMonth() + 1)}-${padNumber(btime.getDate())}`
    + ` ${padNumber(btime.getHours())}:${padNumber(btime.getMinutes())}:${padNumber(btime.getSeconds())}`;
</script>

<template>
    <v-dialog v-model="dialog" width="auto">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img :src="logo" width="48" height="48">
                        <div class="pl-2">
                            About
                        </div>
                    </div>
                </v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-card-title>daxfb-calculator</v-card-title>
            <v-card-subtitle>
                Calculator/Factory Planner for factory management games.
            </v-card-subtitle>
            <v-card-subtitle>
                By doubleaxe (<v-icon :icon="mdiEmail" /><a href="mailto:dax@xdax.ru" target="_blank">dax@xdax.ru</a>,
                <a href="https://github.com/doubleaxe" target="_blank">https://github.com/doubleaxe</a>)
            </v-card-subtitle>
            <v-card-text>
                <v-list :lines="undefined">
                    <v-list-item title="Game">
                        <v-list-item-subtitle>
                            <a v-if="gameDescription.url" :href="gameDescription.url" target="_blank">{{ gameDescription.description }}</a>
                            <span v-else>{{ gameDescription.description }}</span>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item title="Game version" :subtitle="gameDescription.version" />
                    <v-list-item title="Build version" :subtitle="__VERSION__" />
                    <v-list-item title="Build time" :subtitle="__BUILD_TIME_STR__" />
                    <v-list-item title="Bug reports">
                        <v-list-item-subtitle>
                            <a href="https://github.com/doubleaxe/daxfb-calculator/issues" target="_blank">
                                https://github.com/doubleaxe/daxfb-calculator/issues
                            </a>
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
