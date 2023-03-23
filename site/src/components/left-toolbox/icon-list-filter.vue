<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import type {GameItem} from '#types/game-data';
import {injectGameData} from '@/scripts/data';
import {injectFilter} from '@/scripts/filter';
import {syncRef, useDebounceFn} from '@vueuse/core';
import {computed, ref, unref, watch} from 'vue';

const gameData = injectGameData();

const {minTier, maxTier} = gameData.gameDescription;
const allTiers = (maxTier > minTier) ? Array.from(Array(1 + maxTier - minTier), (el, i: number) => (i + minTier)) : [];
const filter = injectFilter();
const allItems = gameData.gameItemsArray;
const filteredItems = ref(allItems);

const pageSize = 10;
const page = ref(1);
const pages = computed(() => (Math.ceil(unref(filteredItems).length / pageSize) || 1));
const currentPage = computed(() => {
    const start = (unref(page) - 1) * pageSize;
    return unref(filteredItems).slice(start, start + pageSize);
});
const select = ref<GameItem | undefined>(undefined);
const search = ref('');
const direction = ref('0');
const tierEqual = ref('0');
const updateSearch = useDebounceFn(() => {
    let val = unref(search);
    val = val && val.trim();
    if(!val) {
        filteredItems.value = allItems;
        page.value = 1;
        return;
    }
    const searchText = val.toLowerCase().split(/\s+/).map((s) => s.trim());
    filteredItems.value = allItems.filter((item) => (
        searchText.every((l) => !l || (item.lowerLabel.indexOf(l) > -1))),
    );
    if(unref(page) > unref(pages)) {
        page.value = unref(pages);
    }
}, 400, {maxWait: 1000});
watch(search, (value, oldValue) => {
    if(value != oldValue)
        updateSearch();
});

syncRef(
    //use this instead of toRef, because otherwise this assignment is hard to find
    computed({
        get: () => filter.key,
        set: (value) => { filter.key = value; },
    }),
    computed({
        get: () => unref(select)?.name,
        set: (value?: string) => { select.value = value ? gameData.getGameItem(value) : undefined; },
    }),
);

syncRef(
    //use this instead of toRef, because otherwise this assignment is hard to find
    computed({
        get: () => filter.direction,
        set: (value) => { filter.direction = value; },
    }),
    computed({
        get: () => Number(unref(direction)),
        set: (value: number) => { direction.value = String(value); },
    }),
);

syncRef(
    //use this instead of toRef, because otherwise this assignment is hard to find
    computed({
        get: () => filter.tierEqual,
        set: (value) => { filter.tierEqual = value; },
    }),
    computed({
        get: () => Number(unref(tierEqual)),
        set: (value: number) => { tierEqual.value = String(value); },
    }),
);
</script>

<template>
    <div class="d-flex">
        <v-autocomplete
            v-model="select"
            v-model:search="search"
            clearable
            no-filter
            hide-details
            label="Item"
            :items="currentPage"
            @focus="(page = 1)"
        >
            <template #prepend-item>
                <v-btn-toggle
                    v-model="direction"
                    density="compact"
                    class="ml-2"
                    group
                    mandatory
                    variant="outlined"
                >
                    <v-btn value="-1">
                        Input
                    </v-btn>
                    <v-btn value="0">
                        All
                    </v-btn>
                    <v-btn value="1">
                        Output
                    </v-btn>
                </v-btn-toggle>
            </template>
            <template #item="{ props, item }">
                <v-list-item v-bind="props" :title="item.raw.label">
                    <template #prepend>
                        <icon-component class="rounded icon-div" :image="item.raw.image" />
                    </template>
                </v-list-item>
            </template>
            <template #selection />
            <template #prepend-inner>
                <icon-component-tooltip
                    v-if="select"
                    class="rounded icon-div"
                    :image="select.image"
                    :tooltip="select.label"
                />
            </template>
            <template #append-item>
                <v-pagination v-model="page" density="compact" :length="pages" :total-visible="5" />
            </template>
        </v-autocomplete>
        <v-select
            v-if="(maxTier > minTier)"
            v-model="filter.tier"
            label="Tier"
            clearable
            hide-details
            :items="allTiers"
        >
            <template #prepend-item>
                <v-btn-toggle
                    v-model="tierEqual"
                    density="compact"
                    group
                    mandatory
                    variant="outlined"
                >
                    <v-btn value="-1">
                        &lt;=
                    </v-btn>
                    <v-btn value="0">
                        =
                    </v-btn>
                    <v-btn value="1">
                        &gt;=
                    </v-btn>
                </v-btn-toggle>
                <v-list-item title="Group By" @click="(filter.groupTier = !filter.groupTier)">
                    <template #prepend>
                        <v-list-item-action start>
                            <v-checkbox v-model="filter.groupTier" hide-details />
                        </v-list-item-action>
                    </template>
                </v-list-item>
            </template>
        </v-select>
    </div>
</template>
