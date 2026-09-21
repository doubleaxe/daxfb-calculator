<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { computed } from 'vue';

import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';

import FactoryIO from './FactoryIO.vue';
import MainIconActions from './MainIconActions.vue';

const { data } = defineProps<FactoryNodeProps>();

const isFat = computed(() => {
    const recipe = data.selectedRecipe;
    return (recipe?.visibleInput?.length ?? 0) > 1 || (recipe?.visibleOutput?.length ?? 0) > 1;
});
const leftSide = computed(() => {
    const recipe = data.selectedRecipe;
    return (data.isFlipped ? recipe?.visibleOutput : recipe?.visibleInput) ?? [];
});
const rightSide = computed(() => {
    const recipe = data.selectedRecipe;
    return (data.isFlipped ? recipe?.visibleInput : recipe?.visibleOutput) ?? [];
});
</script>

<template>
    <div :class="hstack({ alignItems: isFat ? 'start' : 'center' })">
        <div>
            <FactoryIO v-for="io in leftSide" :key="io.itemId" :io="io" />
        </div>
        <div :class="css({ alignSelf: 'center' })">
            <MainIconActions :data="data" />
        </div>
        <div>
            <FactoryIO v-for="io in rightSide" :key="io.itemId" :io="io" />
        </div>
    </div>
</template>
