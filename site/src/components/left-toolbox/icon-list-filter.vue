<script setup lang="ts">
import {dataProvider, type Item} from '@/scripts/data/data';
import {injectFilter} from '@/scripts/filter';
import {useDebounceFn} from '@vueuse/core';
import {computed, ref, unref, watch} from 'vue';

const filter = injectFilter();
const allItems = dataProvider.getAllItems();
const filteredItems = ref(allItems);

const pageSize = 10;
const page = ref(1);
const pages = computed(() => (Math.ceil(unref(filteredItems).length / pageSize)));
const currentPage = computed(() => {
    const start = (unref(page) - 1) * pageSize;
    return unref(filteredItems).slice(start, start + pageSize);
});
const select = ref<Item | undefined>(undefined);
const search = ref('');
const direction = ref('0');
const updateSearch = useDebounceFn(() => {
    const val = unref(search);
    if(!val) {
        filteredItems.value = allItems;
        page.value = 1;
        return;
    }
    const searchText = val.toLowerCase().split(' ').map((s) => s.trim());
    filteredItems.value = allItems.filter((item) => (
        searchText.every((l) => item.lowerLabel.indexOf(l) > -1))
    );
    if(unref(page) > unref(pages)) {
        page.value = unref(pages);
    }
}, 400, {maxWait: 1000});
watch(search, updateSearch);

watch(select, (value) => {
    if(filter.key !== value?.name)
        filter.key = value?.name;
});
watch(() => filter.key, (value) => {
    if(select.value?.name !== value)
        select.value = value ? dataProvider.getItem(value) : undefined;
});

watch(direction, (value) => {
    const v = Number(value);
    if(filter.direction !== v)
        filter.direction = v;
});
watch(() => filter.direction, (value) => {
    const v = String(value);
    if(direction.value !== v)
        direction.value = v;
});

const tierEqual = ref('0');
watch(tierEqual, (value) => {
    const v = Number(value);
    if(filter.tierEqual !== v)
        filter.tierEqual = v;
});
watch(() => filter.tierEqual, (value) => {
    const v = String(value);
    if(tierEqual.value !== v)
        tierEqual.value = v;
});
</script>

<template>
    <div class="d-flex">
        <v-autocomplete
            v-model="select"
            v-model:search="search"
            clearable
            no-filter
            label="Item"
            :items="currentPage"
            @focus="(page = 1)"
        >
            <template #prepend-item>
                <v-btn-toggle v-model="direction" group mandatory variant="outlined">
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
                <v-pagination v-model="page" :length="pages" :total-visible="5" />
            </template>
        </v-autocomplete>
        <v-select
            v-model="filter.tier"
            label="Tier"
            clearable
            :items="[1, 2, 3, 4, 5, 6, 7]"
        >
            <template #prepend-item>
                <v-btn-toggle v-model="tierEqual" group mandatory variant="outlined">
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
            </template>
        </v-select>
    </div>
</template>
