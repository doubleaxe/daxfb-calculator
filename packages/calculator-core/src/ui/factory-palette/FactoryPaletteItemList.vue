<script setup lang="ts">
import { DragOverlay, useDragDropMonitor } from '@dnd-kit/vue';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import Divider from 'primevue/divider';
import { ref } from 'vue';

import type { GameItemBase } from '#core/game/parser/index.js';
import { useGameDataBase } from '#core/game/parser/index.js';
import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';
import { useFilterStoreBase } from '#core/stores/FilterStoreBase.js';

import GameIconDragging from '../components/GameIconDragging.vue';
import GameIconDraggableSelectable from './GameIconDraggableSelectable.vue';

const gameData = useGameDataBase();
const filterStore = useFilterStoreBase();
const factoryPaletteState = useFactoryPaletteState();

const dragItem = ref<GameItemBase | undefined>(undefined);

useDragDropMonitor({
    onDragStart(event) {
        if (typeof event.operation.source?.id === 'string') {
            dragItem.value = gameData.getGameItem(event.operation.source.id);
            factoryPaletteState.setSelectedFactory(undefined);
        }
    },
    onDragEnd() {
        dragItem.value = undefined;
    },
});

const factoryFromEvent = (target: EventTarget | null) => {
    const itemFromEvent = (target as HTMLElement | null)?.closest('[data-item]');
    if (!itemFromEvent) return undefined;
    return gameData.getGameItem(itemFromEvent.getAttribute('data-item') ?? '');
};
const handleItemClick = (factory: GameItemBase | undefined) => {
    if (factory === undefined) {
        factoryPaletteState.setSelectedFactory(undefined);
        return;
    }
    factoryPaletteState.setSelectedFactory(factoryPaletteState.selectedFactory === factory ? undefined : factory);
};
const handleItemKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleItemClick(factoryFromEvent(event.target));
    }
};
</script>

<template>
    <div
        :class="hstack({ gap: '2px', padding: '2', flexWrap: 'wrap' })"
        @click="handleItemClick(factoryFromEvent($event.target))"
        @keydown="handleItemKeydown"
    >
        <template v-for="(group, index) in filterStore.filter" :key="index">
            <Divider v-if="index" />
            <GameIconDraggableSelectable
                v-for="item in group"
                :key="item.key"
                border-style="plain"
                :is-selected="factoryPaletteState.selectedFactory === item"
                :item="item"
            />
        </template>
    </div>
    <Teleport to="body">
        <DragOverlay :drop-animation="null">
            <GameIconDragging :item="dragItem" />
        </DragOverlay>
    </Teleport>
</template>
