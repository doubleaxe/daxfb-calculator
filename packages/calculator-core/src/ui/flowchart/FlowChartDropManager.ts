import { useDragDropMonitor } from '@dnd-kit/vue';
import { useVueFlow } from '@vue-flow/core';
import { ref } from 'vue';

import { type FlowChartModelBase, useFlowChartEvents } from '#core/game/model/index.js';
import type { GameItemBase } from '#core/game/parser/index.js';
import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';
import { FlowChartDroppable } from '#core/types/flowchart/types.js';

export type FlowChartDropIndicatorState = {
    item?: GameItemBase;
    visible?: boolean;
    x: number;
    y: number;
};

export default function useFlowChartDropManager(flowChartModel: FlowChartModelBase) {
    const { screenToFlowCoordinate, vueFlowRef } = useVueFlow();
    const factoryPaletteState = useFactoryPaletteState();
    const dragIndicator = ref<FlowChartDropIndicatorState>({ x: 0, y: 0 });

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
            const position = screenToFlowCoordinate({
                x: rect?.x ?? 0,
                y: rect?.y ?? 0,
            });
            factory.setPosition(position);
        },
    });

    function onPaneMouseLeave() {
        dragIndicator.value = { x: 0, y: 0 };
    }

    function onPaneMouseMove(event: MouseEvent) {
        if (!factoryPaletteState.selectedFactory) return;
        const rect = vueFlowRef.value?.getBoundingClientRect();
        dragIndicator.value = {
            x: event.clientX - (rect?.left ?? 0),
            y: event.clientY - (rect?.top ?? 0),
            visible: true,
            item: factoryPaletteState.selectedFactory,
        };
    }

    function onPaneClick(event: MouseEvent) {
        if (!factoryPaletteState.selectedFactory) return;
        const factory = flowChartModel.addItem(String(factoryPaletteState.selectedFactory.key));
        const position = screenToFlowCoordinate({
            x: event.clientX,
            y: event.clientY,
        });
        factory.setPosition(position);
        factoryPaletteState.setSelectedFactory(undefined);
        dragIndicator.value = { x: 0, y: 0 };
    }

    function onClickOutside() {
        factoryPaletteState.setSelectedFactory(undefined);
        dragIndicator.value = { x: 0, y: 0 };
    }

    useFlowChartEvents(() => [flowChartModel.events.on('paneClickAnywhere', onClickOutside)]);

    return {
        onPaneMouseLeave,
        onPaneMouseMove,
        onPaneClick,
        dragIndicator,
    };
}
