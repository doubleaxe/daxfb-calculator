<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {BlueprintItemModel, RecipeIOModel} from '@/scripts/model/store';
import {mdiSync, mdiLock} from '@mdi/js';
import {formatIo, formatNumber} from '@/scripts/format';
import {__DEBUG__} from '@/scripts/debug';
import {computed} from 'vue';

const props = defineProps<{
    item: BlueprintItemModel;
}>();

const hiddenIo = computed(() => {
    const _recipe = props.item?.selectedRecipe;
    let io = [...(_recipe?.input || []), ...(_recipe?.output || [])];
    if(io.length) {
        io = io.filter(item => item.hideOnWindow);
    }
    return io;
});

function hiddenIoTooltip(io: RecipeIOModel) {
    return `${io.label} ${formatIo(io.cpsSolvedTotal, io)}/${formatIo(io.cpsMaxTotal, io)}`;
}

</script>

<template>
    <div class="status-row bg-window-statusbar">
        <div class="title-text text-caption">
            <template v-if="props.item.isLocked">
                <v-icon :icon="mdiLock" />
            </template>
            <template v-if="props.item.partOfCycle">
                <v-icon :icon="mdiSync" color="warning" />
            </template>
            <template v-if="(props.item.solvedCount !== undefined)">
                {{ (props.item.count ? formatNumber((props.item.solvedCount * 100) / props.item.count) : '0') + '%' }}
                {{ formatNumber(props.item.solvedCount) + ' / ' }}
            </template>
            {{ formatNumber(props.item.count) }}
        </div>
        <div v-if="__DEBUG__" class="float-right mr-1 text-caption">
            {{ props.item.key }}
        </div>
        <div class="float-right mr-1 mt-1 d-flex hidden-io">
            <template v-for="io in hiddenIo" :key="io.key">
                <div class="mr-1">
                    <icon-component-tooltip :image="io.image" :tooltip="hiddenIoTooltip(io)" />
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.status-row {
    display: block;
    position: relative;
    height: 1.2rem;
    overflow: hidden;
}
.hidden-io {
    transform: scale(0.4);
    transform-origin: top right;
}
</style>
