import { DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { Divider, Group } from '@mantine/core';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';

import type { GameItemBase } from '#core/game/parser';
import { useGameDataBase } from '#core/game/parser';
import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState';
import { useFilterStoreBase } from '#core/stores/FilterStoreBase';
import type { GameItemImageJson } from '#daxfb-shared/types/gamedata/common';

import GameIcon from '../components/GameIcon';
import GameIconDraggableAndSelectable from './GameIconDraggableAndSelectable';

const FactoryPaletteItemList = observer(() => {
    const gameData = useGameDataBase();
    const filterStore = useFilterStoreBase();
    const factoryPaletteState = useFactoryPaletteState();

    const [dragItem, setDragItem] = useState<GameItemImageJson | undefined>(undefined);

    useDndMonitor({
        onDragStart(event) {
            if (typeof event.active.id === 'string') {
                setDragItem(gameData.getGameItem(event.active.id)?.image);
            }
        },
        onDragEnd() {
            setDragItem(undefined);
        },
    });

    const factoryFromEvent = (target: EventTarget) => {
        const itemFromEvent = (target as HTMLElement).closest('[data-item]');
        if (!itemFromEvent) return undefined;
        return gameData.getGameItem(itemFromEvent.getAttribute('data-item') ?? '');
    };
    const handleItemClick = action((factory: GameItemBase | undefined) => {
        if (factory === undefined) {
            factoryPaletteState.setSelectedFactory(undefined);
            return;
        }
        factoryPaletteState.setSelectedFactory(factoryPaletteState.selectedFactory === factory ? undefined : factory);
    });

    return (
        <>
            <Group
                gap='0.1875rem'
                onClick={(e) => handleItemClick(factoryFromEvent(e.target))}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleItemClick(factoryFromEvent(e.target));
                    }
                }}
            >
                {filterStore.filter.map((group, index) => (
                    <Fragment key={index}>
                        {index ? <Divider /> : undefined}
                        {group.map((item) => (
                            <GameIconDraggableAndSelectable
                                isSelected={factoryPaletteState.selectedFactory === item}
                                item={item}
                                key={item.key}
                            />
                        ))}
                    </Fragment>
                ))}
            </Group>
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    <GameIcon image={dragItem} />
                </DragOverlay>,
                document.body
            )}
        </>
    );
});

export default FactoryPaletteItemList;
