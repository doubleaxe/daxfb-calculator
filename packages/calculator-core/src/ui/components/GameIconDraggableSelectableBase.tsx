import type { RecipeVariantProps } from '@doubleaxe/daxfb-calculator-styles/css';
import { cva, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import type { HTMLAttributes, Ref } from 'react';

import type { GameItemImageJson } from '#core/game/parser';

import GameIcon from '../components/GameIcon';
import { draggableSelectableStyles } from '../styles/DraggableSelectable';

const iconStyles = cva({
    base: {
        borderRadius: 'var(--mantine-radius-md)',
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

export type IconVariants = RecipeVariantProps<typeof iconStyles>;

type Props = {
    image?: GameItemImageJson;
    isSelected?: boolean;
    ref?: Ref<HTMLInputElement>;
} & HTMLAttributes<HTMLDivElement> &
    IconVariants;

export default function GameIconDraggableSelectableBase({ image, isSelected, borderStyle, ref, ...htmlProps }: Props) {
    return (
        <div
            ref={ref}
            {...htmlProps}
            aria-selected={isSelected}
            className={cx(
                iconStyles({ borderStyle }),
                draggableSelectableStyles({ hover: 'cursor', transition: 'lift', select: 'data' }),
                htmlProps.className
            )}
            data-selected={isSelected ? true : undefined}
        >
            <GameIcon image={image} />
        </div>
    );
}
