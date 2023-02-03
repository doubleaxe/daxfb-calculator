<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {nextTick, ref, unref} from 'vue';
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiContentSave} from '@mdi/js';
import {injectSettings} from '@/scripts/settings';
import {BlueprintEncoder} from '@/scripts/model/serializer';
import { dataProvider } from '@/scripts/data/data';

const blueprintModel = injectBlueprintModel();
const settings = injectSettings();
const description = dataProvider.getDescription();
const objectUrl = ref<string | null>(null);
const objectAnchor = ref<HTMLElement | null>(null);

function saveBlueprint() {
    if(objectUrl.value) {
        URL.revokeObjectURL(objectUrl.value);
        objectUrl.value = null;
    }
    //recreate anchor
    nextTick(() => {
        const encoder = new BlueprintEncoder(settings);
        const encoded = encoder.split(encoder.encode(blueprintModel.save()));
        const blob = new Blob([encoded], {type: 'text/plain'});
        objectUrl.value = URL.createObjectURL(blob);
        nextTick(() => {
            unref(objectAnchor)?.click();
        });
    });
}
</script>

<template>
    <tooltip-button tooltip="Save" :icon="mdiContentSave" @click="saveBlueprint" />
    <a
        v-if="objectUrl"
        ref="objectAnchor"
        :download="`blueprint-${description.Name}.txt`"
        :href="objectUrl"
        class="d-none"
    />
</template>
