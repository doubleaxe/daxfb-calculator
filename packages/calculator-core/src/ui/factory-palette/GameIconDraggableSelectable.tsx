import { useDraggable } from '@dnd-kit/core';

import type { GameItemBase } from '#core/game/parser/index.js';

import type { IconVariants } from '../components/GameIconDraggableSelectableBase.js';
import GameIconDraggableSelectableBase from '../components/GameIconDraggableSelectableBase.jsx';

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
