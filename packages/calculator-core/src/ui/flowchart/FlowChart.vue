<script setup lang="ts">
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { useVueFlow, VueFlow } from '@vue-flow/core';
import type { Component } from 'vue';
import { watch } from 'vue';

import type { FactoryModelBase, IOLinkModelBase } from '#core/game/model/index.js';
import { useFlowChartModelBase } from '#core/game/model/index.js';
import { FactoryEdgeTypeName } from '#core/types/flowchart/edge/types.js';
import type { FactoryNodeType } from '#core/types/flowchart/node/types.js';
import { FactoryNodeTypeName, NodeDragHandleClass } from '#core/types/flowchart/node/types.js';

import ConnectionLine from './edge/ConnectionLine.vue';
import FactoryEdge from './edge/FactoryEdge.vue';
import useFlowChartConnectionManager from './FlowChartConnectionManager.js';
import FlowChartDropIndicator from './FlowChartDropIndicator.vue';
import useFlowChartDropManager from './FlowChartDropManager.js';
import FactoryNode from './node/FactoryNode.vue';

const nodeTypes: Record<string, Component> = { [FactoryNodeTypeName]: FactoryNode as Component };
const edgeTypes: Record<string, Component> = { [FactoryEdgeTypeName]: FactoryEdge as Component };

const flowChartModel = useFlowChartModelBase();
const { setNodes, setEdges, findNode } = useVueFlow();

function syncNodes(items: FactoryModelBase[]) {
    return items.map((factory) => {
        const existing = findNode(factory.itemId);
        if (existing) return existing;
        return {
            id: factory.itemId,
            type: FactoryNodeTypeName,
            position: { ...factory.position },
            dragHandle: `.${NodeDragHandleClass}`,
            data: { itemId: factory.itemId },
        } as FactoryNodeType;
    });
}

function syncEdges(links: IOLinkModelBase[]) {
    return links.map((link) => ({
        id: link.linkId,
        type: FactoryEdgeTypeName,
        source: link.output.factory.itemId,
        sourceHandle: link.output.itemId,
        target: link.input.factory.itemId,
        targetHandle: link.input.itemId,
        data: { linkId: link.linkId },
    }));
}

setNodes(syncNodes([...flowChartModel.items]));
setEdges(syncEdges([...flowChartModel.links]));

watch(
    () => flowChartModel.itemsGeneration,
    () => {
        setNodes(syncNodes([...flowChartModel.items]));
    },
    { flush: 'post' }
);
watch(
    () => flowChartModel.linksGeneration,
    () => {
        setEdges(syncEdges([...flowChartModel.links]));
    },
    { flush: 'post' }
);

const { onClickConnectStart, onClickConnectEnd, onConnectStart, onConnectEnd, onConnect, isValidConnection } =
    useFlowChartConnectionManager(flowChartModel);
const { dragIndicator, onPaneMouseLeave, onPaneMouseMove, onPaneClick } = useFlowChartDropManager(flowChartModel);

const onNodeDragStop = (event: { node: { id: string; position: { x: number; y: number }; type?: string } }) => {
    if (event.node.type === FactoryNodeTypeName) {
        const data = flowChartModel.itemByKey(event.node.id);
        data?.setPosition(event.node.position);
    }
};
</script>

<template>
    <VueFlow
        :connection-radius="40"
        :edge-types="edgeTypes"
        :is-valid-connection="isValidConnection"
        :node-types="nodeTypes"
        @click-connect-end="onClickConnectEnd"
        @click-connect-start="onClickConnectStart"
        @connect="onConnect"
        @connect-end="onConnectEnd"
        @connect-start="onConnectStart"
        @node-drag-stop="onNodeDragStop"
        @pane-click="onPaneClick"
        @pane-mouse-leave="onPaneMouseLeave"
        @pane-mouse-move="onPaneMouseMove"
    >
        <Background />
        <Controls />
        <FlowChartDropIndicator v-bind="dragIndicator" />
        <template #connection-line="connectionLineProps">
            <ConnectionLine v-bind="connectionLineProps" />
        </template>
    </VueFlow>
</template>
