import { useDraggable } from '@dnd-kit/core';
import type { RecipeVariantProps } from '@doubleaxe/daxfb-calculator-styles/css';
import { cva, cx } from '@doubleaxe/daxfb-calculator-styles/css';

import type { GameItemBase } from '#core/game/parser';

import GameIcon from '../components/GameIcon';
import { draggableSelectableStyles } from '../styles/DraggableSelectable';

const iconStyles = cva({
    base: {
        borderRadius: 'var(--mantine-radius-md)',
        _hover: {
            transform: 'translateY(-2px)',
            _selected: {
                transform: 'translateY(-2px) scale(1.05)',
            },
        },
        _selected: {
            transform: 'scale(1.05)',
        },
    },
    variants: {
        borderStyle: {
            plain: {
                borderColor: 'transparent',
                _light: {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                },
                _dark: {
                    boxShadow: '0 2px 4px rgba(255, 255, 255, 0.2)',
                },
            },
        },
    },
});

type IconVariants = RecipeVariantProps<typeof iconStyles>;

type Props = {
    isSelected?: boolean;
    item: GameItemBase;
} & IconVariants;

export default function GameIconDraggableSelectable({ item, isSelected, borderStyle }: Props) {
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
            className={cx(
                iconStyles({ borderStyle }),
                draggableSelectableStyles({ hover: 'cursor', transition: 'lift' })
            )}
            data-item={item.key}
            data-selected={isSelected ? true : undefined}
            tabIndex={0}
        >
            <GameIcon image={item.image} />
        </div>
    );
}
