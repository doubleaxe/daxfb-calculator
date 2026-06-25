import './flow.css';

import { useDroppable } from '@dnd-kit/react';
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { ReactFlowProvider } from '@xyflow/react';
import type { MouseEvent as ReactMouseEvent } from 'react';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import { FlowChartDroppable } from '#core/types/flowchart/types.js';

import FlowChart from './FlowChart.jsx';

export default function FlowChartFrame() {
    const flowChartModel = useFlowChartModelBase();
    const droppable = useDroppable({ id: FlowChartDroppable });

    const setNodeRef = (element: HTMLDivElement | null) => {
        droppable.ref(element);
    };

    const onClick = (event: ReactMouseEvent) => {
        flowChartModel.events.emit('paneClickAnywhere', event.nativeEvent);
    };

    return (
        <div className={css({ width: '100%', height: '100%' })} onClick={onClick} ref={setNodeRef}>
            <ReactFlowProvider>
                <FlowChart />
            </ReactFlowProvider>
        </div>
    );
}
