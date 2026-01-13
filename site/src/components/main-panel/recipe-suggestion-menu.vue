<!--
Author: Cherecho (GitHub: @Cherecho)
Based on recipes-menu.vue by Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Feature: Show recipe suggestions when output is dropped in empty space
-->
<script setup lang="ts">
import { GameRecipeIOFlags } from "#types/constants";
import type { GameItem, GameRecipe, GameRecipeIO } from "#types/game-data";
import { injectGameData } from "@/scripts/data";
import { mdiArrowRight, mdiClose } from "@mdi/js";
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
const menuPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
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

// Compute menu style based on position
const menuStyle = computed(() => {
  const pos = unref(menuPosition);
  return {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
  };
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
  menuPosition.value = {
    x: screenPosition.x,
    y: screenPosition.y,
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
  <Teleport to="body">
    <!-- Backdrop for click outside -->
    <div v-if="active" class="recipe-suggestion-backdrop" @click="closeMenu" />
    <!-- Menu positioned at drop location -->
    <div v-if="active" class="recipe-suggestion-menu" :style="menuStyle">
      <v-card elevation="8" class="menu-card">
        <v-card-title class="menu-header">
          <span>Add consuming factory</span>
          <v-btn
            size="small"
            variant="text"
            :icon="mdiClose"
            @click="closeMenu"
          />
        </v-card-title>
        <v-divider />
        <v-list density="compact" class="menu-list">
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
      </v-card>
    </div>
  </Teleport>
</template>

<style scoped>
.recipe-suggestion-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
  background: transparent;
}

.recipe-suggestion-menu {
  position: fixed;
  z-index: 9999;
  max-height: 80vh;
  overflow: visible;
}

.menu-card {
  min-width: 280px;
  max-width: 400px;
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  font-size: 0.875rem;
}

.menu-list {
  overflow-y: auto;
  flex: 1;
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
