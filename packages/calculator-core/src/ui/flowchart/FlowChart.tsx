import { useDragDropMonitor } from '@dnd-kit/react';
import type { Node as FlowNode, OnNodeDrag } from '@xyflow/react';
import { Background, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import { action, reaction } from 'mobx';

import type { FactoryModelBase, IOLinkModelBase } from '#core/game/model/index.js';
import { useFlowChartModelBase } from '#core/game/model/index.js';
import type { FactoryEdgeType } from '#core/types/flowchart/edge/types.js';
import { FactoryEdgeTypeName } from '#core/types/flowchart/edge/types.js';
import type { FactoryNodeType } from '#core/types/flowchart/node/types.js';
import { FactoryNodeTypeName, NodeDragHandleClass } from '#core/types/flowchart/node/types.js';
import { FlowChartDroppable } from '#core/types/flowchart/types.js';
import { useReaction } from '#core/utils/hooks.js';

import ConnectionLine from './edge/ConnectionLine.jsx';
import FactoryEdge from './edge/FactoryEdge.jsx';
import useFlowChartConnectionManager from './FlowChartConnectionManager.js';
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
    const { screenToFlowPosition } = useReactFlow();
    const flowChartModel = useFlowChartModelBase();
    const { onClickConnectStart, onClickConnectEnd, onConnectStart, onConnectEnd, onConnect, isValidConnection } =
        useFlowChartConnectionManager(flowChartModel);

    useReaction(
        () =>
            reaction(
                () => flowChartModel.items,
                (items) => {
                    // sync schema and react flow
                    setNodes(syncNodes(nodes, [...items]));
                },
                { delay: 1 }
            ),
        [flowChartModel, setNodes, nodes]
    );

    useReaction(
        () =>
            reaction(
                () => flowChartModel.links,
                (items) => {
                    // sync schema and react flow
                    setEdges(syncEdges(edges, [...items]));
                },
                { delay: 1 }
            ),
        [flowChartModel, setEdges, edges]
    );

    const onNodeDragStop: OnNodeDrag<FlowNode> = action((event, node) => {
        if (node.type === FactoryNodeTypeName) {
            const data = flowChartModel.itemByKey(node.id);
            data?.setPosition(node.position);
        }
    });

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
        >
            <Background />
            <Controls />
        </ReactFlow>
    );
}
