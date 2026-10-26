<script setup lang="ts">
import { hstack } from '@daxfb/styles/patterns';
import { DragOverlay, useDragDropMonitor } from '@dnd-kit/vue';
import Divider from 'primevue/divider';
import { shallowRef } from 'vue';

import type { GameItemBase } from '#core/game/parser/index.js';
import { useGameDataBase } from '#core/game/parser/index.js';
import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';
import { useFilterStoreBase } from '#core/stores/FilterStoreBase.js';
import { useStatusBarStore } from '#core/stores/StatusBarStore.js';

import GameIconDragging from '../components/GameIconDragging.vue';
import GameIconDraggableSelectable from './GameIconDraggableSelectable.vue';

const gameData = useGameDataBase();
const filterStore = useFilterStoreBase();
const factoryPaletteState = useFactoryPaletteState();
const statusBarStore = useStatusBarStore();

const dragItem = shallowRef<GameItemBase | undefined>(undefined);

useDragDropMonitor({
    onDragStart(event) {
        if (typeof event.operation.source?.id === 'string') {
            const draggedFactory = gameData.getGameItem(event.operation.source.id);
            dragItem.value = draggedFactory;
            factoryPaletteState.setSelectedFactory(undefined);
            statusBarStore.setHoveredItem(undefined);
            statusBarStore.setSelectedItem(draggedFactory?.label);
        }
    },
    onDragEnd() {
        dragItem.value = undefined;
        statusBarStore.setSelectedItem(undefined);
    },
});

function factoryFromEvent(target: EventTarget | null) {
    const itemFromEvent = (target as HTMLElement | null)?.closest('[data-item]');
    if (!itemFromEvent) return undefined;
    return gameData.getGameItem(itemFromEvent.getAttribute('data-item') ?? '');
}

function handleItemClick(factory: GameItemBase | undefined) {
    if (factory === undefined) {
        factoryPaletteState.setSelectedFactory(undefined);
        statusBarStore.setSelectedItem(undefined);
        return;
    }
    const selectedFactory = factoryPaletteState.selectedFactory === factory ? undefined : factory;
    factoryPaletteState.setSelectedFactory(selectedFactory);
    statusBarStore.setSelectedItem(selectedFactory?.label);
}

function handleItemHover(event: PointerEvent) {
    statusBarStore.setHoveredItem(factoryFromEvent(event.target)?.label);
}

function handleItemLeave() {
    statusBarStore.setHoveredItem(undefined);
}

function handleItemKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleItemClick(factoryFromEvent(event.target));
    }
}
</script>

<template>
    <div
        :class="hstack({ gap: '0.5', padding: '2', flexWrap: 'wrap' })"
        @click="handleItemClick(factoryFromEvent($event.target))"
        @keydown="handleItemKeydown"
        @pointerleave="handleItemLeave"
        @pointerover="handleItemHover"
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
