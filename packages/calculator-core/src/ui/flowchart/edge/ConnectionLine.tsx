import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import type { ConnectionLineComponentProps } from '@xyflow/react';
import { getBezierPath, useConnection } from '@xyflow/react';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import { useFlowChartModelBase } from '#core/game/model/index.js';

const ConnectionLine = observer((props: ConnectionLineComponentProps) => {
    const { fromHandle } = useConnection();
    const flowChartModel = useFlowChartModelBase();
    const data = computed(() => flowChartModel.findIo(fromHandle?.nodeId ?? '', fromHandle?.id ?? '')).get();
    if (!data) {
        return null;
    }

    const [edgePath] = getBezierPath({
        sourceX: props.fromX,
        sourceY: props.fromY,
        sourcePosition: props.fromPosition,
        targetX: props.toX,
        targetY: props.toY,
        targetPosition: props.toPosition,
    });

    return (
        <g>
            <path
                className={css({
                    stroke: 'var(--mantine-color-text)',
                    strokeWidth: 'var(--game-icon-size-quarter)',
                    fill: 'none',
                })}
                d={edgePath}
            />
        </g>
    );
});

export default ConnectionLine;
