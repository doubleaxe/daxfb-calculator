<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {calculateSummary, injectBlueprintModel, type SummaryTotals} from '@/scripts/model/store';
import {onMounted, shallowRef, unref, watch} from 'vue';
import {mdiImport, mdiExport} from '@mdi/js';
import {GameItemType} from '#types/contants';

const blueprintModel = injectBlueprintModel();
const summary = shallowRef<SummaryTotals>([]);
const showTotals: Partial<Record<GameItemType, boolean>> = {
    // energy is only interesting type here
    [GameItemType.Energy]: true,
};

const props = defineProps<{
    compact?: boolean;
}>();

function updateSummary() {
    const _summary = calculateSummary(blueprintModel);
    summary.value = _summary;
}

watch(() => blueprintModel.summaryGenerationNumber, () => {
    updateSummary();
});
onMounted(() => {
    updateSummary();
});
</script>

<template>
    <v-list :lines="undefined">
        <template v-for="{isInput, totals} in unref(summary)" :key="isInput">
            <v-list-item :class="props.compact ? 'pl-1' : ''">
                <template #prepend>
                    <v-icon :icon="isInput ? mdiImport : mdiExport" color="primary" />
                </template>
                <template #title>
                    <div v-if="!props.compact" class="pl-2 text-body-1 text-primary font-weight-bold">
                        {{ isInput ? 'Input' : 'Output' }}
                    </div>
                </template>
            </v-list-item>
            <v-divider />
            <template v-for="total in totals" :key="isInput + '#' + total.type">
                <template v-for="item in total.items" :key="isInput + '#' + total.type + '#' + item.item.name">
                    <summary-item :item="item" :compact="props.compact" />
                </template>
                <v-divider />
                <template v-if="showTotals[total.type] && (total.items.length > 1)">
                    <summary-total-item :total="total" :compact="props.compact" />
                    <v-divider />
                </template>
            </template>
        </template>
    </v-list>
</template>
