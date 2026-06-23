import { css } from '@doubleaxe/daxfb-calculator-styles/css';

import type { GameItemBase } from '#core/game/parser/index.js';

import GameIconDragging from '../components/GameIconDragging.jsx';

export type FlowChartDropIndicatorProps = {
    item?: GameItemBase;
    visible?: boolean;
    x: number;
    y: number;
};

export function FlowChartDropIndicator({ x, y, visible, item }: FlowChartDropIndicatorProps) {
    if (!visible) return null;

    return (
        <div
            className={css({
                position: 'absolute',
                top: '0px',
                left: '0px',
                pointerEvents: 'none',
            })}
            style={{
                transform: `translate(${x}px, ${y}px)`,
            }}
        >
            <GameIconDragging item={item} />
        </div>
    );
}
