import { useDraggable } from '@dnd-kit/core';

import type { GameItemBase } from '#core/game/parser';

import type { IconVariants } from '../components/GameIconDraggableSelectableBase';
import GameIconDraggableSelectableBase from '../components/GameIconDraggableSelectableBase';

type Props = {
    isSelected?: boolean;
    item: GameItemBase;
} & IconVariants;

export default function GameIconDraggableSelectable({ item, ...props }: Props) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: item.key,
        attributes: {
            role: 'img',
        },
    });

    return (
        <GameIconDraggableSelectableBase
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            {...props}
            data-item={item.key}
            image={item.image}
            tabIndex={0}
        />
    );
}
