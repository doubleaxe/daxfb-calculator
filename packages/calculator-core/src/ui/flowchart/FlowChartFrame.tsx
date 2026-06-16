import './flow.css';

import { useDroppable } from '@dnd-kit/react';
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { ReactFlowProvider } from '@xyflow/react';

import { FlowChartDroppable } from '#core/types/flowchart/types.js';

import FlowChart from './FlowChart.jsx';

export default function FlowChartFrame() {
    const droppable = useDroppable({ id: FlowChartDroppable });

    const setNodeRef = (element: HTMLDivElement | null) => {
        droppable.ref(element);
    };

    return (
        <div className={css({ width: '100%', height: '100%' })} ref={setNodeRef}>
            <ReactFlowProvider>
                <FlowChart />
            </ReactFlowProvider>
        </div>
    );
}
