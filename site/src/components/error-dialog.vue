<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiClose} from '@mdi/js';
import {ref} from 'vue';
import {useErrorHandler} from '@/composables';
import {ErrorCollector} from '@/scripts/error-collector';

const dialog = ref(false);
const expanded = ref(false);
const title = ref('');
const details = ref<string[]>([]);
const color = ref('');

const {errorHandler} = useErrorHandler();
errorHandler.value = (_title, _error, _isWarning) => {
    title.value = _title;
    expanded.value = false;
    dialog.value = true;
    color.value = _isWarning ? 'warning' : 'error';

    const errorCollector = (_error instanceof ErrorCollector) ? _error : new ErrorCollector().collectError(_error);
    details.value = errorCollector.print();
};
</script>

<template>
    <v-dialog v-model="dialog">
        <v-card>
            <v-toolbar :color="color">
                <v-toolbar-title>{{ (color == 'warning') ? 'Warning' : 'Error' }}</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>
                <v-expansion-panels v-if="details.length">
                    <v-expansion-panel v-model="expanded">
                        <v-expansion-panel-title>Error Details</v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-list :lines="undefined" density="compact">
                                <v-list-item v-for="text in details" :key="text" :title="text" />
                            </v-list>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
