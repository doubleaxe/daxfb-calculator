<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import { PhLinkBreak, PhList, PhTrash } from '@phosphor-icons/vue';
import Button from 'primevue/button';
import Menu, { type MenuMethods } from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import { computed, useTemplateRef } from 'vue';

import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';

const { data } = defineProps<FactoryNodeProps>();

const menu = useTemplateRef<MenuMethods | null>('menu');

const items = computed<MenuItem[]>(() => [
    {
        label: 'Delete all links',
        command: () => data.deleteAllLinks(),
        iconComponent: PhLinkBreak,
    },
    {
        label: 'Delete',
        command: () => data.deleteItem(),
        iconComponent: PhTrash,
    },
]);

function toggle(event: Event) {
    const _menu = menu.value;
    if (!_menu) return;
    _menu.toggle(event);
}

defineExpose({ toggle });
</script>

<template>
    <Button :class="css({ padding: '0' })" severity="secondary" aria-label="Menu" @click="toggle">
        <PhList />
    </Button>
    <Menu ref="menu" :model="items" popup>
        <template #itemicon="{ item }">
            <component :is="item['iconComponent']" />
        </template>
    </Menu>
</template>
