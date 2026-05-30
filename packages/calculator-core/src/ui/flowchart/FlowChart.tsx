/* eslint-disable react-hooks/refs */
import { useDndMonitor } from '@dnd-kit/core';
import type { Node as FlowNode, OnConnect, OnConnectEnd, OnConnectStart, OnNodeDrag } from '@xyflow/react';
import { Background, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import { action, reaction } from 'mobx';
import { useRef } from 'react';

import type { FactoryModelBase, IOLinkModelBase, RecipeIOModelBase } from '#core/game/model/index.js';
import { EdgeStatus, useFlowChartModelBase } from '#core/game/model/index.js';
import type { FactoryEdgeType } from '#core/types/flowchart/edge/types.js';
import { FactoryEdgeTypeName } from '#core/types/flowchart/edge/types.js';
import type { FactoryNodeType } from '#core/types/flowchart/node/types.js';
import { FactoryNodeTypeName, NodeDragHandleClass } from '#core/types/flowchart/node/types.js';
import { FlowChartDroppable } from '#core/types/flowchart/types.js';
import { useReaction } from '#core/utils/hooks.js';

import ConnectionLine from './edge/ConnectionLine.jsx';
import FactoryEdge from './edge/FactoryEdge.jsx';
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

type ActiveConn = {
    source: RecipeIOModelBase | undefined;
    target: RecipeIOModelBase | undefined;
};

function clearActiveConnection(_activeConn: ActiveConn) {
    if (_activeConn.source) {
        _activeConn.source.status = EdgeStatus.None;
        _activeConn.source = undefined;
    }
    if (_activeConn.target) {
        _activeConn.target.status = EdgeStatus.None;
        _activeConn.target = undefined;
    }
}

export default function FlowChart() {
    const [nodes, setNodes, onNodesChange] = useNodesState<FactoryNodeType>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<FactoryEdgeType>([]);
    const { screenToFlowPosition } = useReactFlow();
    const flowChartModel = useFlowChartModelBase();
    const activeConn = useRef({} as ActiveConn);

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

    const onClickConnectStart: OnConnectStart = action((event, params) => {
        clearActiveConnection(activeConn.current);
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            io.status = EdgeStatus.ClickSource;
            activeConn.current.source = io;
        }
    });

    const onClickConnectEnd: OnConnectEnd = action(() => {
        clearActiveConnection(activeConn.current);
    });

    const onConnectStart: OnConnectStart = action((_event, params) => {
        clearActiveConnection(activeConn.current);
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            io.status = EdgeStatus.DragSource;
            activeConn.current.source = io;
        }
    });

    const onConnectEnd: OnConnectEnd = action(() => {
        clearActiveConnection(activeConn.current);
    });

    const onConnect: OnConnect = action((connection) => {
        flowChartModel.createLink({
            sourceId: connection.source,
            sourceIOId: connection.sourceHandle ?? '',
            targetId: connection.target,
            targetIOId: connection.targetHandle ?? '',
        });
        clearActiveConnection(activeConn.current);
    });

    useDndMonitor({
        onDragEnd(event) {
            if (event.over?.id !== FlowChartDroppable) {
                return;
            }
            const factoryKey = event.active.id;
            const factory = flowChartModel.addItem(String(factoryKey));
            const rect = event.active.rect.current.translated;
            const position = screenToFlowPosition({
                x: rect?.left ?? 0,
                y: rect?.top ?? 0,
            });
            factory.setPosition(position);
        },
    });

    return (
        <ReactFlow
            connectionLineComponent={ConnectionLine}
            edgeTypes={edgeTypes}
            edges={edges}
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
