<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import { hstack } from '@daxfb/styles/patterns';
import { useDebounceFn } from '@vueuse/core';
import AutoComplete, {
    type AutoCompleteCompleteEvent,
    type AutoCompleteDropdownClickEvent,
    type AutoCompleteOptionSelectEvent,
} from 'primevue/autocomplete';
import Paginator, { type PageState } from 'primevue/paginator';
import SelectButton from 'primevue/selectbutton';
import { computed, ref } from 'vue';

import type { GameItemBase } from '#core/game/parser/index.js';
import { isAbstractClassItem, useGameDataBase } from '#core/game/parser/index.js';
import { useFilterStoreBase } from '#core/stores/FilterStoreBase.js';

import GameIcon from '../components/GameIcon.vue';

const ITEMS_PER_PAGE = 10;

const gameData = useGameDataBase();
const filter = useFilterStoreBase();

const search = ref('');
const filteredItems = ref<GameItemBase[]>([]);
const firstRecordIndex = ref(0);
const directionOptions = [
    { label: 'Input', value: -1 },
    { label: 'All', value: 0 },
    { label: 'Output', value: 1 },
];

const selectedItem = computed(() => (filter.key ? gameData.getGameItem(filter.key) : undefined));

function updateFilteredItems() {
    const _allItems = gameData.gameItemsArray.filter((item) => !isAbstractClassItem(item));
    const _search = search.value.trim();
    let _filteredItems = _allItems;
    if (_search) {
        const searchTerms = _search
            .toLowerCase()
            .split(/\s+/)
            .map((s) => s.trim());

        _filteredItems = _allItems.filter((item) =>
            searchTerms.every((term) => !term || item.lowerLabel.includes(term))
        );
    }

    filteredItems.value = _filteredItems;
    firstRecordIndex.value = 0;
}

const debouncedUpdateFilteredItems = useDebounceFn(
    () => {
        updateFilteredItems();
    },
    400,
    { maxWait: 1000 }
);

function toGameItem({ option, value }: { option?: any; value?: any }): GameItemBase {
    return (value ?? option) as GameItemBase;
}

const currentPageItems = computed(() => {
    const start = firstRecordIndex.value;
    return filteredItems.value.slice(start, start + ITEMS_PER_PAGE);
});

function handleComplete(event: AutoCompleteCompleteEvent) {
    // console.log(`handleComplete ${event.query}`);
    search.value = event.query ?? '';
    debouncedUpdateFilteredItems().catch(() => {});
}

function handleDropdownClick(_event: AutoCompleteDropdownClickEvent) {
    // console.log(`handleDropdownClick ${event.query}`);
    updateFilteredItems();
}

function handleSelect(value: AutoCompleteOptionSelectEvent) {
    filter.setKey(toGameItem(value).key);
}

function handleClear() {
    filter.setKey(undefined);
    search.value = '';
    updateFilteredItems();
}

function handleDirectionChange(value: number) {
    filter.setDirection(value);
}

function handlePageChange(event: PageState) {
    firstRecordIndex.value = event.first;
}
/*
:pt="{
        overlay: {
          class: css({
            maxHeight: '25rem'
          })
        },
        list: {
          class: css({
            maxHeight: '20rem',
            overflowY: 'auto'
          })
        },
        option: {
          class: css({
            '&[data-p-highlight=\"true\"]': {
              backgroundColor: 'var(--mantine-primary-color-light)',
              color: 'var(--mantine-color-text)'
            }
          })
        }
      }"

:pt="{
              root: {
                class: css({
                  flexWrap: 'nowrap',
                  padding: '0.25rem 0.5rem'
                })
              },
              page: {
                class: css({
                  minWidth: '1.75rem',
                  height: '1.75rem',
                  fontSize: '0.85rem'
                })
              }
            }"
*/
</script>

<template>
    <div :class="hstack({ gap: '2' })">
        <AutoComplete
            :model-value="selectedItem"
            :suggestions="currentPageItems"
            dropdown
            option-label="label"
            placeholder="Filter item..."
            scroll-height="20rem"
            show-clear
            @item-select="handleSelect"
            @clear="handleClear"
            @complete="handleComplete"
            @dropdown-click="handleDropdownClick"
        >
            <template #header>
                <div :class="hstack({ justifyContent: 'center', gap: '1' })">
                    <SelectButton
                        :model-value="filter.direction"
                        :options="directionOptions"
                        option-label="label"
                        option-value="value"
                        size="small"
                        :allow-empty="false"
                        @update:model-value="handleDirectionChange"
                    />
                </div>
            </template>
            <template #option="slotProps">
                <div :class="hstack({ gap: '1' })">
                    <GameIcon :image="toGameItem(slotProps).image" />
                    <span>{{ toGameItem(slotProps).label }}</span>
                </div>
            </template>
            <template #empty>
                <div :class="css({ textAlign: 'center', padding: '1', color: 'stone.400' })">Nothing found</div>
            </template>
            <template #footer>
                <div
                    v-if="filteredItems.length > ITEMS_PER_PAGE"
                    :class="css({ borderTop: '1px solid var(--mantine-color-default-border)' })"
                >
                    <Paginator
                        :rows="ITEMS_PER_PAGE"
                        :total-records="filteredItems.length"
                        :first="firstRecordIndex"
                        template="PrevPageLink PageLinks NextPageLink"
                        @page="handlePageChange"
                    />
                </div>
            </template>
        </AutoComplete>
    </div>
</template>
