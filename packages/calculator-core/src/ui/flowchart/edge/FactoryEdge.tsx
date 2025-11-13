import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import { observer } from 'mobx-react-lite';

import type { FactoryEdgeType } from './types';

const FactoryEdge = observer((props: EdgeProps<FactoryEdgeType>) => {
    const [edgePath] = getBezierPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: props.sourcePosition,
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: props.targetPosition,
    });

    return <BaseEdge path={edgePath} />;
});

export default FactoryEdge;
