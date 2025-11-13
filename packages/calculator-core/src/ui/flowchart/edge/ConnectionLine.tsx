import type { ConnectionLineComponentProps } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';
import { observer } from 'mobx-react-lite';

const ConnectionLine = observer((props: ConnectionLineComponentProps) => {
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
            <path className='react-flow__edge-path' d={edgePath} />
        </g>
    );
});

export default ConnectionLine;
