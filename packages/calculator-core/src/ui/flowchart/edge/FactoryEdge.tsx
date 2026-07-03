import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import type { FactoryEdgeType } from '#core/types/flowchart/edge/types.js';

const FactoryEdge = observer((props: EdgeProps<FactoryEdgeType>) => {
    const flowChartModel = useFlowChartModelBase();
    const data = computed(() => flowChartModel.linkByKey(props.id)).get();
    if (!data) {
        return null;
    }

    const [edgePath] = getBezierPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: props.sourcePosition,
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: props.targetPosition,
    });

    return (
        <BaseEdge
            className={css({
                stroke: 'var(--mantine-color-text)',
                strokeWidth: 'var(--game-icon-size-quarter)',
                fill: 'none',
            })}
            path={edgePath}
        />
    );
});

export default FactoryEdge;
