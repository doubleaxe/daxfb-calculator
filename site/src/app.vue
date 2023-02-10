<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {ref, unref, watch, computed, onMounted} from 'vue';
import {injectBlueprintModel} from './scripts/model/store';
import IconDraggable from './components/left-toolbox/icon-draggable.vue';
import BlueprintPanel from './components/main-panel/blueprint-panel.vue';
import {dataProvider} from './scripts/data/data';

const drawer = ref(true);
const blueprintModel = injectBlueprintModel();
const hasCycles = ref(false);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hasAlerts = computed(() => unref(hasCycles));
const description = dataProvider.getDescription();

watch(() => blueprintModel.hasCycles, (value: boolean) => {
    //display only when changed, then user may hide it
    hasCycles.value = value;
});
onMounted(() => {
    const __TRACK__: string = import.meta.env.VITE_TRACK;
    const getCounter = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const goatcounter: {count?: () => void} = (window as any).goatcounter;
        return (goatcounter && goatcounter.count) ? goatcounter : undefined;
    };
    if(__TRACK__ && !getCounter()) {
        const tracker = document.createElement('script');
        tracker.setAttribute('async', 'async');
        tracker.setAttribute('data-goatcounter', 'https://lbc.xdax.ru/count');
        tracker.setAttribute('data-goatcounter-settings', '{"no_onload": true}');
        tracker.setAttribute('src', 'https://lbc.xdax.ru/count.js');
        document.head.appendChild(tracker);
        const timer = setInterval(function() {
            const goatcounter = getCounter();
            if(goatcounter && goatcounter.count) {
                clearInterval(timer);
                goatcounter.count();
            }
        }, 100);
    }
});
</script>

<template>
    <error-dialog />
    <icon-draggable />
    <v-app class="main-window">
        <v-app-bar density="compact">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </template>
            <v-app-bar-title>{{ `${description.Description} Calculator/Factory Planner` }}</v-app-bar-title>
            <template #append>
                <main-toolbar />
            </template>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" permanent>
            <icon-list-panel />
        </v-navigation-drawer>
        <v-main scrollable>
            <blueprint-panel />
        </v-main>
        <!--
        <v-footer v-if="hasAlerts" app>
            <v-alert v-model="hasCycles" type="warning" closable>
                Blueprint has cycles  - marked with
                <v-icon :icon="mdiSync" />
                icon.
            </v-alert>
        </v-footer>
        -->
    </v-app>
</template>

<style scoped>
.main-window {
    height: 100%;
    width: 100%;
}
.main-scrollbar {
    height: 100%;
    display:inline-block;
    overflow: scroll;
}
</style>
