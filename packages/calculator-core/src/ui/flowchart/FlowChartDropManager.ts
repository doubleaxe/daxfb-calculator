import { useDragDropMonitor } from '@dnd-kit/react';
import { useReactFlow } from '@xyflow/react';
import { action } from 'mobx';
import { type MouseEvent as ReactMouseEvent, useState } from 'react';

import type { FlowChartModelBase } from '#core/game/model/index.js';
import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';
import { FlowChartDroppable } from '#core/types/flowchart/types.js';

import type { FlowChartDropIndicatorProps } from './FlowChartDropIndicator.jsx';

export default function useFlowChartDropManager(flowChartModel: FlowChartModelBase) {
    const { screenToFlowPosition } = useReactFlow();
    const factoryPaletteState = useFactoryPaletteState();
    const [dragIndicator, setDragIndicator] = useState<FlowChartDropIndicatorProps>({ x: 0, y: 0 });

    useDragDropMonitor({
        onDragEnd(event) {
            if (event.operation.target?.id !== FlowChartDroppable) {
                return;
            }
            const factoryKey = event.operation.source?.id;
            if (!factoryKey) {
                return;
            }
            const factory = flowChartModel.addItem(String(factoryKey));
            const rect = event.operation.position.current;
            const position = screenToFlowPosition({
                x: rect?.x ?? 0,
                y: rect?.y ?? 0,
            });
            factory.setPosition(position);
        },
    });

    const onPaneMouseLeave: (event: ReactMouseEvent<Element, MouseEvent>) => void = action(() => {
        setDragIndicator({ x: 0, y: 0 });
    });

    const onPaneMouseMove: (event: ReactMouseEvent<Element, MouseEvent>) => void = action((event) => {
        if (!factoryPaletteState.selectedFactory) return;
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });
        setDragIndicator({ x: position.x, y: position.y, visible: true, item: factoryPaletteState.selectedFactory });
    });

    const onPaneClick: (event: ReactMouseEvent<Element, MouseEvent>) => void = action((event) => {
        if (!factoryPaletteState.selectedFactory) return;
        const factory = flowChartModel.addItem(String(factoryPaletteState.selectedFactory.key));
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });
        factory.setPosition(position);
        factoryPaletteState.selectedFactory = undefined;
        setDragIndicator({ x: 0, y: 0 });
    });

    const onClickOutside: (event: ReactMouseEvent<Element, MouseEvent>) => void = action(() => {
        factoryPaletteState.selectedFactory = undefined;
        setDragIndicator({ x: 0, y: 0 });
    });

    return {
        onPaneMouseLeave,
        onPaneMouseMove,
        onPaneClick,
        onClickOutside,
        dragIndicator,
    };
}
