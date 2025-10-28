import { useDroppable } from '@dnd-kit/core';
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { ReactFlowProvider } from '@xyflow/react';

import FlowChart from './FlowChart';
import { FlowChartDroppable } from './types';

export default function FlowChartFrame() {
    const { setNodeRef } = useDroppable({ id: FlowChartDroppable });

    return (
        <div className={css({ width: '100%', height: '100%' })} ref={setNodeRef}>
            <ReactFlowProvider>
                <FlowChart />
            </ReactFlowProvider>
        </div>
    );
}
