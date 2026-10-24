<script setup lang="ts">
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { ConnectionMode, type EdgeComponent, type NodeComponent, useVueFlow, VueFlow } from '@vue-flow/core';
import type { Component } from 'vue';
import { markRaw, onMounted, watch } from 'vue';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import { type FactoryEdgeType, FactoryEdgeTypeName } from '#core/types/flowchart/edge/types.js';
import type { FactoryNodeType } from '#core/types/flowchart/node/types.js';
import { FactoryNodeTypeName, NodeDragHandleClass } from '#core/types/flowchart/node/types.js';

import ConnectionLine from './edge/ConnectionLine.vue';
import FactoryEdge from './edge/FactoryEdge.vue';
import useFlowChartConnectionManager from './FlowChartConnectionManager.js';
import FlowChartDropIndicator from './FlowChartDropIndicator.vue';
import useFlowChartDropManager from './FlowChartDropManager.js';
import FactoryNode from './node/FactoryNode.vue';

const nodeTypes: Record<string, NodeComponent> = { [FactoryNodeTypeName]: markRaw(FactoryNode as Component) };
const edgeTypes: Record<string, EdgeComponent> = { [FactoryEdgeTypeName]: markRaw(FactoryEdge as Component) };

const flowChartModel = useFlowChartModelBase();
const { setNodes, setEdges, findNode, findEdge } = useVueFlow();

function syncNodes() {
    const items = flowChartModel.items;
    const nodes = [...items].map((factory) => {
        const existing = findNode(factory.itemId);
        if (existing) return existing;
        return {
            id: factory.itemId,
            type: FactoryNodeTypeName,
            position: { ...factory.position },
            dragHandle: `.${NodeDragHandleClass}`,
            data: { itemId: factory.itemId },
        } satisfies FactoryNodeType;
    });
    setNodes(nodes);
}

function syncEdges() {
    const links = flowChartModel.links;
    const edges = [...links].map((link) => {
        const existing = findEdge(link.linkId);
        if (existing) return existing;
        return {
            id: link.linkId,
            type: FactoryEdgeTypeName,
            source: link.output.factory.itemId,
            sourceHandle: link.output.itemId,
            target: link.input.factory.itemId,
            targetHandle: link.input.itemId,
            data: { linkId: link.linkId },
        } satisfies FactoryEdgeType;
    });
    setEdges(edges);
}

watch(() => flowChartModel.itemsGeneration, syncNodes, { flush: 'post' });
watch(() => flowChartModel.linksGeneration, syncEdges, { flush: 'post' });

const { onClickConnectStart, onClickConnectEnd, onConnectStart, onConnectEnd, onConnect, isValidConnection } =
    useFlowChartConnectionManager(flowChartModel);
const { dragIndicator, onPaneMouseLeave, onPaneMouseMove, onPaneClick } = useFlowChartDropManager(flowChartModel);

function onNodeDragStop(event: { node: { id: string; position: { x: number; y: number }; type?: string } }) {
    if (event.node.type === FactoryNodeTypeName) {
        const data = flowChartModel.itemByKey(event.node.id);
        data?.setPosition(event.node.position);
    }
}

onMounted(() => {
    syncNodes();
    syncEdges();
});
</script>

<template>
    <VueFlow
        :connection-radius="40"
        :connection-mode="ConnectionMode.Strict"
        :edge-types="edgeTypes"
        :is-valid-connection="isValidConnection"
        :node-types="nodeTypes"
        connect-on-click
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
