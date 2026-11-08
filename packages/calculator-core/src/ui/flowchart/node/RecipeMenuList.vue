<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import { hstack } from '@daxfb/styles/patterns';
import { PhArrowRight } from '@phosphor-icons/vue';
import Menu, { type MenuMethods } from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import { computed, useTemplateRef } from 'vue';

import type { FactoryModelBase } from '#core/game/model/index.js';
import { type GameRecipeBase, type GameRecipeIOBase, GameRecipeIOFlagsBase } from '#core/game/parser/index.js';
import GameIcon from '#core/ui/components/GameIcon.vue';

const { data } = defineProps<{ data: FactoryModelBase }>();

const menu = useTemplateRef<MenuMethods | null>('menu');

const menuPt = {
    root: {
        class: css({ maxHeight: '[100%]', minWidth: '0!', overflowY: 'auto' }),
    },
};

const selectedClass = css({ backgroundColor: 'content.hoverBackground' });

const items = computed<MenuItem[]>(() =>
    data.recipes.map((recipe) => ({
        key: recipe.key,
        label: recipe.output.map((io) => io.name).join(', '),
        recipe,
        class: data.selectedRecipe?.key === recipe.key ? selectedClass : undefined,
        command: () => data.selectRecipe(recipe.key),
    }))
);

function isVisible(io: GameRecipeIOBase) {
    return !((io.flags ?? 0) & GameRecipeIOFlagsBase.Hidden);
}

function visibleInput(recipe: GameRecipeBase) {
    return recipe.input.filter(isVisible);
}

function visibleOutput(recipe: GameRecipeBase) {
    return recipe.output.filter(isVisible);
}

function toggle(event: Event) {
    const _menu = menu.value;
    if (!_menu) return;
    _menu.toggle(event);
}

defineExpose({ toggle });
</script>

<template>
    <Menu ref="menu" :model="items" :pt="menuPt" popup>
        <template #item="{ item, props }">
            <a v-bind="props.action" :class="hstack({ alignItems: 'center', gap: '0.5' })">
                <GameIcon v-for="io in visibleInput(item['recipe'])" :key="io.key" :image="io.product.image" />
                <PhArrowRight :class="css({ flexShrink: 0 })" />
                <GameIcon v-for="io in visibleOutput(item['recipe'])" :key="io.key" :image="io.product.image" />
            </a>
        </template>
    </Menu>
</template>
