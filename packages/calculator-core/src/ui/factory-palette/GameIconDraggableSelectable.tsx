import { useDraggable } from '@dnd-kit/react';

import type { GameItemBase } from '#core/game/parser/index.js';

import type { IconVariants } from '../components/GameIconDraggableSelectableBase.js';
import GameIconDraggableSelectableBase from '../components/GameIconDraggableSelectableBase.jsx';

type Props = {
    isSelected?: boolean;
    item: GameItemBase;
} & IconVariants;

export default function GameIconDraggableSelectable({ item, ...props }: Props) {
    const draggable = useDraggable({
        id: item.key,
    });

    const setNodeRef = (element: HTMLDivElement | null) => {
        draggable.ref(element);
    };

    return (
        <GameIconDraggableSelectableBase
            {...props}
            data-item={item.key}
            image={item.image}
            ref={setNodeRef}
            tabIndex={0}
        />
    );
}
