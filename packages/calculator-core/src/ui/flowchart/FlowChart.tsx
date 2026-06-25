import type { Node as FlowNode, OnNodeDrag } from '@xyflow/react';
import { Background, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import { action, reaction } from 'mobx';

import type { FactoryModelBase, IOLinkModelBase } from '#core/game/model/index.js';
import { useFlowChartModelBase } from '#core/game/model/index.js';
import type { FactoryEdgeType } from '#core/types/flowchart/edge/types.js';
import { FactoryEdgeTypeName } from '#core/types/flowchart/edge/types.js';
import type { FactoryNodeType } from '#core/types/flowchart/node/types.js';
import { FactoryNodeTypeName, NodeDragHandleClass } from '#core/types/flowchart/node/types.js';
import { useReaction } from '#core/utils/hooks.js';

import ConnectionLine from './edge/ConnectionLine.jsx';
import FactoryEdge from './edge/FactoryEdge.jsx';
import useFlowChartConnectionManager from './FlowChartConnectionManager.js';
import { FlowChartDropIndicator } from './FlowChartDropIndicator.js';
import useFlowChartDropManager from './FlowChartDropManager.js';
import FactoryNode from './node/FactoryNode.jsx';

const nodeTypes = {
    [FactoryNodeTypeName]: FactoryNode,
};

const edgeTypes = {
    [FactoryEdgeTypeName]: FactoryEdge,
};

function syncNodes(nds: FactoryNodeType[], items: FactoryModelBase[]) {
    const oldNodes = new Map(nds.map((n) => [n.id, n]));
    const newNodes = items.map((factory) => {
        let node = oldNodes.get(factory.itemId);
        node ??= {
            id: factory.itemId,
            type: FactoryNodeTypeName,
            position: factory.position,
            dragHandle: `.${NodeDragHandleClass}`,
            data: { itemId: factory.itemId },
        };
        return node;
    });
    return newNodes;
}

function syncEdges(edges: FactoryEdgeType[], links: IOLinkModelBase[]) {
    const oldEdges = new Map(edges.map((n) => [n.id, n]));
    const newEdges = links.map((link) => {
        let edge = oldEdges.get(link.linkId);
        edge ??= {
            id: link.linkId,
            type: FactoryEdgeTypeName,
            source: link.output.factory.itemId,
            sourceHandle: link.output.itemId,
            target: link.input.factory.itemId,
            targetHandle: link.input.itemId,
            data: { linkId: link.linkId },
        };
        return edge;
    });
    return newEdges;
}

export default function FlowChart() {
    const [nodes, setNodes, onNodesChange] = useNodesState<FactoryNodeType>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<FactoryEdgeType>([]);
    const flowChartModel = useFlowChartModelBase();
    const { onClickConnectStart, onClickConnectEnd, onConnectStart, onConnectEnd, onConnect, isValidConnection } =
        useFlowChartConnectionManager(flowChartModel);
    const { dragIndicator, onPaneMouseLeave, onPaneMouseMove, onPaneClick } = useFlowChartDropManager(flowChartModel);

    useReaction(
        () =>
            reaction(
                () => flowChartModel.itemsGeneration,
                () => {
                    // sync schema and react flow
                    setNodes(syncNodes(nodes, [...flowChartModel.items]));
                },
                { delay: 1 }
            ),
        [flowChartModel]
    );

    useReaction(
        () =>
            reaction(
                () => flowChartModel.linksGeneration,
                () => {
                    // sync schema and react flow
                    setEdges(syncEdges(edges, [...flowChartModel.links]));
                },
                { delay: 1 }
            ),
        [flowChartModel]
    );

    const onNodeDragStop: OnNodeDrag<FlowNode> = action((event, node) => {
        if (node.type === FactoryNodeTypeName) {
            const data = flowChartModel.itemByKey(node.id);
            data?.setPosition(node.position);
        }
    });

    return (
        <ReactFlow
            connectionLineComponent={ConnectionLine}
            connectionRadius={40}
            edgeTypes={edgeTypes}
            edges={edges}
            isValidConnection={isValidConnection}
            nodeTypes={nodeTypes}
            nodes={nodes}
            onClickConnectEnd={onClickConnectEnd}
            onClickConnectStart={onClickConnectStart}
            onConnect={onConnect}
            onConnectEnd={onConnectEnd}
            onConnectStart={onConnectStart}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            onNodesChange={onNodesChange}
            onPaneClick={onPaneClick}
            onPaneMouseLeave={onPaneMouseLeave}
            onPaneMouseMove={onPaneMouseMove}
        >
            <Background />
            <Controls />
            <FlowChartDropIndicator {...dragIndicator} />
        </ReactFlow>
    );
}
