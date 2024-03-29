<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {GameRecipeIOFlags} from '#types/constants';
import type {GameRecipe, GameRecipeIO} from '#types/game-data';
import {injectGameData} from '@/scripts/data';
import {injectFilter} from '@/scripts/filter';
import type {BlueprintItemModel} from '@/scripts/model/store';
import {mdiArrowRight, mdiContentPaste} from '@mdi/js';
import {useDebounceFn} from '@vueuse/core';
import {computed, nextTick, ref, unref, watch} from 'vue';

const gameData = injectGameData();
const filter = injectFilter();

type Activator = {item: BlueprintItemModel; activator: Element};
const item = ref<BlueprintItemModel | undefined>(undefined);
const activator = ref<Element | undefined>(undefined);
const active = ref<boolean>(false);
const search = ref<string>('');
const allRecipes = ref<GameRecipe[]>([]);
const recipes = ref<GameRecipe[]>([]);
let waitingForClose: Activator | undefined = undefined;

const pageSize = 10;
const page = ref(1);
const maxPages = computed(() => (Math.ceil(unref(allRecipes).length / pageSize)));
const pages = computed(() => (Math.ceil(unref(recipes).length / pageSize) || 1));
const currentPage = computed(() => {
    const start = (unref(page) - 1) * pageSize;
    return unref(recipes).slice(start, start + pageSize);
});
const canPasteSeacrhValue = computed(() => filter.key ? mdiContentPaste : '');

function recipeSelected(name: string) {
    unref(item)?.selectRecipe(name);
}

function performActivate(_activatorObj: Activator) {
    activator.value = _activatorObj.activator;
    nextTick(() => {
        active.value = true;

        const sameItem = (unref(item)?.key == _activatorObj.item.key);
        if(!sameItem) {
            item.value = _activatorObj.item;
            allRecipes.value = [..._activatorObj.item.recipes];
            recipes.value = allRecipes.value;
            page.value = 1;
            search.value = '';
        }
    });
}

function activate(_item: BlueprintItemModel, _activator: Element) {
    if(_item.recipesCount <= 1)
        return;
    const sameItem = (unref(item)?.key == _item.key);
    if(sameItem && unref(active)) {
        //menu will close itself
        active.value = false;
        return;
    }

    //menu implementation will capture this click too
    //and it will hide just opened menu
    //we need to wait a little, so all transitions are completed
    const _activatorObj = {item: _item, activator: _activator};
    if(unref(active)) {
        waitingForClose = _activatorObj;
        setTimeout(activateOnClose, 400);
    } else {
        performActivate(_activatorObj);
    }
}
function activateOnClose() {
    if(!waitingForClose)
        return;
    const _waitingForClose = waitingForClose;
    waitingForClose = undefined;
    activator.value = undefined;
    nextTick(() => {
        performActivate(_waitingForClose);
    });
}

const applyFilter = useDebounceFn(() => {
    let val = unref(search);
    val = val && val.trim();
    if(!val) {
        recipes.value = unref(allRecipes);
        page.value = 1;
        return;
    }
    const searchText = val.toLowerCase().split(/\s+/).map((s) => s.trim());
    recipes.value = unref(allRecipes).filter((recipe) => (
        searchText.every((l) => !l || (
            recipe.input.some((io) => io.product.lowerLabel.indexOf(l) > -1))
            || recipe.output.some((io) => io.product.lowerLabel.indexOf(l) > -1),
        )
    ));
    if(unref(page) > unref(pages)) {
        page.value = unref(pages);
    }
}, 400, {maxWait: 1000});

function pasteSearchValue() {
    if(!filter.key)
        return;
    const newSearch = gameData.getGameItem(filter.key)?.label;
    if(newSearch)
        search.value = newSearch;
}

function filterShownRecipeIo(io: GameRecipeIO[]) {
    return io.filter((i) => !(i.flags & GameRecipeIOFlags.HideInMenu));
}

watch(active, (value, oldValue) => {
    if(oldValue && !value) {
        activator.value = undefined;
    }
});
watch(search, (value, oldValue) => {
    if(oldValue != value) {
        applyFilter();
    }
});

defineExpose({
    activate,
});
</script>

<template>
    <v-menu v-model="active" :activator="activator" @click:outside="activateOnClose">
        <v-list density="compact">
            <v-list-item v-if="(maxPages > 1)" class="minwidth">
                <v-text-field
                    v-model="search"
                    density="compact"
                    :prepend-inner-icon="canPasteSeacrhValue"
                    hide-details
                    clearable
                    @click.stop
                    @click:prepend-inner.stop="pasteSearchValue"
                />
            </v-list-item>
            <optimized-tooltip>
                <v-list-item
                    v-for="recipe in currentPage"
                    :key="recipe.name"
                    :value="recipe.name"
                    :active="(item?.selectedRecipe?.name == recipe.name)"
                    @click="recipeSelected(recipe.name)"
                >
                    <v-list-item-title>
                        <div class="io-menu-item">
                            <recipes-menu-io :ioarray="filterShownRecipeIo(recipe.input)" />
                            <v-icon class="d-block" :icon="mdiArrowRight" />
                            <recipes-menu-io :ioarray="filterShownRecipeIo(recipe.output)" />
                        </div>
                    </v-list-item-title>
                </v-list-item>
            </optimized-tooltip>
            <v-list-item v-if="(maxPages > 1)" class="minwidth">
                <v-pagination v-model="page" density="compact" :length="pages" :total-visible="4" @click.stop />
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<style scoped>
.io-menu-item {
    display: flex;
    align-items: center;
}
.minwidth {
    min-width: 15rem;
}
</style>
