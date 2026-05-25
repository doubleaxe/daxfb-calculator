import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';

import type { GameItemBase } from '#core/game/parser/index.js';
import { draggingStyle } from '#core/styles/Dragging.js';

import GameIcon from './GameIcon.jsx';

type Props = {
    item: GameItemBase | undefined;
};

export default function GameIconDragging({ item }: Props) {
    return (
        <div
            className={cx(
                css({ backgroundColor: 'var(--mantine-color-body)', borderRadius: 'var(--mantine-radius-md)' }),
                draggingStyle
            )}
            data-dragging
        >
            {item ? <GameIcon image={item?.image} /> : undefined}
        </div>
    );
}
