import { useDraggable } from '@dnd-kit/core';

import type { GameItemBase } from '#core/game/parser';

import GameIcon from '../components/GameIcon';
import iconStyles from '../styles/DraggableAndSelectable';

type Props = {
    isSelected?: boolean;
    item: GameItemBase;
};

export default function GameIconDraggableAndSelectable({ item, isSelected }: Props) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: item.key,
        attributes: {
            role: 'img',
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            aria-selected={isSelected}
            className={iconStyles}
            data-item={item.key}
            data-selected={isSelected ? true : undefined}
            tabIndex={0}
        >
            <GameIcon image={item.image} />
        </div>
    );
}
