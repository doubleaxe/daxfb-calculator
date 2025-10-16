import { useDraggable } from '@dnd-kit/core';
import { css } from '@doubleaxe/daxfb-calculator-styles/css';

import type { GameItemBase } from '#core/game/parser';

import GameIcon from '../components/GameIcon';

type Props = {
    isSelected?: boolean;
    item: GameItemBase;
};

export default function GameIconDraggableAndSelectable({ item, isSelected }: Props) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: item.key,
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            aria-pressed={isSelected}
            className={css({
                cursor: 'pointer',
                touchAction: 'none',
            })}
            data-item={item.key}
            tabIndex={0}
        >
            <GameIcon image={item.image} />
        </div>
    );
}
