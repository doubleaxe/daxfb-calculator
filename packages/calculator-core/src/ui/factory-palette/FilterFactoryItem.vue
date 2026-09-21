<script setup lang="ts">
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { refDebounced } from '@vueuse/core';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import { computed, ref, watch } from 'vue';

import type { GameItemBase } from '#core/game/parser/index.js';
import { isAbstractClassItem, useGameDataBase } from '#core/game/parser/index.js';
import { useFilterStoreBase } from '#core/stores/FilterStoreBase.js';

import GameIcon from '../components/GameIcon.vue';

const ITEMS_PER_PAGE = 10;

const gameData = useGameDataBase();
const filter = useFilterStoreBase();

const search = ref('');
const debouncedSearch = refDebounced(search, 400);
const requestedPage = ref(1);
const model = ref<GameItemBase | string | undefined>(undefined);

const filteredItems = computed(() => {
    const allItems = gameData.gameItemsArray.filter((item) => !isAbstractClassItem(item));
    if (!debouncedSearch.value.trim()) {
        return allItems;
    }

    const searchTerms = debouncedSearch.value
        .toLowerCase()
        .split(/\s+/)
        .map((s) => s.trim());
    return allItems.filter((item) => searchTerms.every((term) => !term || item.lowerLabel.includes(term)));
});

watch(
    () => filter.key,
    (key) => {
        if (key) {
            const item = gameData.getGameItem(key);
            if (item) model.value = item;
        } else {
            model.value = undefined;
        }
    },
    { immediate: true }
);

const totalPages = computed(() => Math.ceil(filteredItems.value.length / ITEMS_PER_PAGE) || 1);
const effectivePage = computed(() => Math.min(requestedPage.value, totalPages.value));
const currentPageItems = computed(() => {
    const start = (effectivePage.value - 1) * ITEMS_PER_PAGE;
    return filteredItems.value.slice(start, start + ITEMS_PER_PAGE);
});

watch(debouncedSearch, () => {
    requestedPage.value = 1;
});

const onComplete = (event: { query: string }) => {
    search.value = event.query ?? '';
};

const onOptionSelect = (event: { value: GameItemBase }) => {
    filter.setKey(event.value.key);
};

const onClear = () => {
    filter.setKey(undefined);
    search.value = '';
    model.value = undefined;
};

const onPage = (event: { page: number }) => {
    requestedPage.value = event.page + 1;
};
</script>

<template>
    <div :class="hstack({ gap: '2' })">
        <AutoComplete
            v-model="model"
            :suggestions="currentPageItems"
            dropdown
            option-label="label"
            placeholder="Filter item..."
            scroll-height="20rem"
            show-clear
            @clear="onClear"
            @complete="onComplete"
            @option-select="onOptionSelect"
        >
            <template #header>
                <div :class="hstack({ justify: 'center', gap: '1' })">
                    <Button
                        label="Input"
                        size="small"
                        :severity="filter.direction === -1 ? 'primary' : 'secondary'"
                        :variant="filter.direction === -1 ? 'filled' : 'outlined'"
                        @click="filter.setDirection(-1)"
                    />
                    <Button
                        label="All"
                        size="small"
                        :severity="filter.direction === 0 ? 'primary' : 'secondary'"
                        :variant="filter.direction === 0 ? 'filled' : 'outlined'"
                        @click="filter.setDirection(0)"
                    />
                    <Button
                        label="Output"
                        size="small"
                        :severity="filter.direction === 1 ? 'primary' : 'secondary'"
                        :variant="filter.direction === 1 ? 'filled' : 'outlined'"
                        @click="filter.setDirection(1)"
                    />
                </div>
            </template>
            <template #option="slotProps">
                <div :class="hstack({ gap: '2' })">
                    <GameIcon :image="slotProps.option.image" />
                    {{ slotProps.option.label }}
                </div>
            </template>
            <template #footer>
                <Paginator
                    :first="(effectivePage - 1) * ITEMS_PER_PAGE"
                    :rows="ITEMS_PER_PAGE"
                    template="PrevPageLink PageLinks NextPageLink"
                    :total-records="filteredItems.length"
                    @page="onPage"
                />
            </template>
        </AutoComplete>
    </div>
</template>
