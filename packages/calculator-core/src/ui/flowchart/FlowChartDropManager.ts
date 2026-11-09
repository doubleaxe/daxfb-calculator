import { useDragDropMonitor } from '@dnd-kit/vue';
import { useVueFlow } from '@vue-flow/core';
import { ref } from 'vue';

import { type FlowChartModelBase, useFlowChartEvents } from '#core/game/model/index.js';
import type { GameItemBase } from '#core/game/parser/index.js';
import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';
import { FlowChartDroppable, FlowChartFrameId } from '#core/types/flowchart/types.js';

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
        const haveAnyMode = factoryPaletteState.selectedFactory;
        if (!haveAnyMode) return;

        const target = event.target instanceof HTMLElement || event.target instanceof SVGElement ? event.target : null;
        let current = target;
        let aboveAnyItem = false;
        while (current && current !== document.body && current.getAttribute('id') !== FlowChartFrameId) {
            if (current.classList.contains('vue-flow__node') || current.classList.contains('vue-flow__edge')) {
                aboveAnyItem = true;
                break;
            }
            current = current.parentElement;
        }
        if (aboveAnyItem) {
            // we are above factory or connection line
            dragIndicator.value = { x: 0, y: 0 };
            return;
        }

        if (factoryPaletteState.selectedFactory) {
            // drop from palette
            const rect = vueFlowRef.value?.getBoundingClientRect();
            dragIndicator.value = {
                x: event.clientX - (rect?.left ?? 0),
                y: event.clientY - (rect?.top ?? 0),
                visible: true,
                item: factoryPaletteState.selectedFactory,
            };
        }
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
