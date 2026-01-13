<!--
Author: Cherecho (GitHub: @Cherecho)
Based on recipes-menu.vue by Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Feature: Show recipe suggestions when output is dropped in empty space
-->
<script setup lang="ts">
import { GameRecipeIOFlags } from "#types/constants";
import type { GameItem, GameRecipe, GameRecipeIO } from "#types/game-data";
import { injectGameData } from "@/scripts/data";
import { mdiArrowRight } from "@mdi/js";
import { useDebounceFn } from "@vueuse/core";
import { computed, nextTick, ref, unref, watch } from "vue";
import type { ReadonlyPointType } from "@/scripts/geometry";

const gameData = injectGameData();

interface RecipeWithFactory {
  factory: GameItem;
  recipe: GameRecipe;
}

const active = ref<boolean>(false);
const search = ref<string>("");
const allRecipes = ref<RecipeWithFactory[]>([]);
const recipes = ref<RecipeWithFactory[]>([]);
const menuStyle = ref<{ left: string; top: string }>({
  left: "0px",
  top: "0px",
});
const sourceProductName = ref<string>("");
const dropScreenPosition = ref<ReadonlyPointType>({ x: 0, y: 0 });

const pageSize = 10;
const page = ref(1);
const maxPages = computed(() => Math.ceil(unref(allRecipes).length / pageSize));
const pages = computed(() => Math.ceil(unref(recipes).length / pageSize) || 1);
const currentPage = computed(() => {
  const start = (unref(page) - 1) * pageSize;
  return unref(recipes).slice(start, start + pageSize);
});

const emit = defineEmits<{
  (
    e: "recipe-selected",
    factory: GameItem,
    recipe: GameRecipe,
    productName: string,
    screenPosition: ReadonlyPointType
  ): void;
}>();

function findRecipesUsingInput(itemName: string): RecipeWithFactory[] {
  const results: RecipeWithFactory[] = [];
  for (const factory of gameData.gameFactoriesArray) {
    const dict = factory.recipeDictionary;
    if (!dict) continue;
    const recipeNames = dict.recipesByInputMap.get(itemName);
    if (recipeNames) {
      for (const recipeName of recipeNames) {
        const recipe = dict.recipesMap.get(recipeName);
        if (recipe) {
          results.push({ factory, recipe });
        }
      }
    }
  }
  return results;
}

function activate(productName: string, screenPosition: ReadonlyPointType) {
  const foundRecipes = findRecipesUsingInput(productName);
  if (foundRecipes.length === 0) {
    return; // No recipes found, don't show menu
  }

  sourceProductName.value = productName;
  dropScreenPosition.value = screenPosition;
  allRecipes.value = foundRecipes;
  recipes.value = foundRecipes;
  page.value = 1;
  search.value = "";

  // Position menu at drop location
  menuStyle.value = {
    left: `${screenPosition.x}px`,
    top: `${screenPosition.y}px`,
  };

  nextTick(() => {
    active.value = true;
  });
}

function recipeSelected(item: RecipeWithFactory) {
  active.value = false;
  emit(
    "recipe-selected",
    item.factory,
    item.recipe,
    unref(sourceProductName),
    unref(dropScreenPosition)
  );
}

function closeMenu() {
  active.value = false;
}

const applyFilter = useDebounceFn(
  () => {
    let val = unref(search);
    val = val && val.trim();
    if (!val) {
      recipes.value = unref(allRecipes);
      page.value = 1;
      return;
    }
    const searchText = val
      .toLowerCase()
      .split(/\s+/)
      .map((s) => s.trim());
    recipes.value = unref(allRecipes).filter((item) =>
      searchText.every(
        (l) =>
          !l ||
          item.recipe.input.some(
            (io) => io.product.lowerLabel.indexOf(l) > -1
          ) ||
          item.recipe.output.some(
            (io) => io.product.lowerLabel.indexOf(l) > -1
          ) ||
          item.factory.lowerLabel.indexOf(l) > -1
      )
    );
    if (unref(page) > unref(pages)) {
      page.value = unref(pages);
    }
  },
  400,
  { maxWait: 1000 }
);

function filterShownRecipeIo(io: GameRecipeIO[]) {
  return io.filter((i) => !(i.flags & GameRecipeIOFlags.HideInMenu));
}

watch(search, (value, oldValue) => {
  if (oldValue != value) {
    applyFilter();
  }
});

defineExpose({
  activate,
});
</script>

<template>
  <v-menu
    v-model="active"
    :style="menuStyle"
    location="end"
    :close-on-content-click="false"
    @click:outside="closeMenu"
  >
    <template #activator="{ props }">
      <div v-bind="props" class="menu-activator" :style="menuStyle" />
    </template>
    <v-list density="compact">
      <v-list-subheader> Add consuming factory </v-list-subheader>
      <v-list-item v-if="maxPages > 1" class="minwidth">
        <v-text-field
          v-model="search"
          density="compact"
          placeholder="Search recipes..."
          hide-details
          clearable
          @click.stop
        />
      </v-list-item>
      <optimized-tooltip>
        <v-list-item
          v-for="(item, index) in currentPage"
          :key="index"
          @click="recipeSelected(item)"
        >
          <v-list-item-title>
            <div class="io-menu-item">
              <icon-component
                :image="item.factory.image"
                :data-tooltip="item.factory.label"
              />
              <span class="factory-label">{{ item.factory.label }}</span>
            </div>
            <div class="io-menu-item recipe-row">
              <recipes-menu-io
                :ioarray="filterShownRecipeIo(item.recipe.input)"
              />
              <v-icon class="d-block" :icon="mdiArrowRight" />
              <recipes-menu-io
                :ioarray="filterShownRecipeIo(item.recipe.output)"
              />
            </div>
          </v-list-item-title>
        </v-list-item>
      </optimized-tooltip>
      <v-list-item v-if="maxPages > 1" class="minwidth">
        <v-pagination
          v-model="page"
          density="compact"
          :length="pages"
          :total-visible="4"
          @click.stop
        />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
.menu-activator {
  position: fixed;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
.io-menu-item {
  display: flex;
  align-items: center;
}
.factory-label {
  margin-left: 0.5rem;
  font-weight: 500;
}
.recipe-row {
  margin-top: 0.25rem;
  padding-left: 1.5rem;
  opacity: 0.8;
}
.minwidth {
  min-width: 15rem;
}
</style>
